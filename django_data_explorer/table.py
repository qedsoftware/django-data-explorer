import operator
import functools
import json

from django.template.loader import render_to_string
from django.utils.encoding import smart_text, python_2_unicode_compatible
from django.utils.html import mark_safe

from datatableview.datatables import LegacyDatatable

from .widget import Widget


class QuerysetDatatable(LegacyDatatable):
    def __init__(self, object_list=(), url='', query_config=None, *args, **kwargs):
        super(QuerysetDatatable, self).__init__(
            object_list, url, query_config=query_config, *args, **kwargs)
        self.allowed_options = [
            'search', 'start_offset', 'page_length', 'ordering', 'filters']

    def normalize_config(self, config, query_config):
        if config['hidden_columns'] is None:
            config['hidden_columns'] = []
        if config['search_fields'] is None:
            config['search_fields'] = []
        if config['unsortable_columns'] is None:
            config['unsortable_columns'] = []

        for option in self.allowed_options:
            normalizer_f = getattr(self, 'normalize_config_{}'.format(option))
            config[option] = normalizer_f(config, query_config)
        return config

    @staticmethod
    def normalize_config_filters(dummy, query_config):
        filters = []
        filters_input = query_config.get('filters', None)
        if filters_input:
            for filter_params in filters_input.split(','):
                column_name, lookup, term = filter_params.split(';')
                filters.append((column_name, lookup, term))
        return filters

    def search_column(self, column, terms, lookup_types):
        return column.search(self.model, terms, lookup_types)

    def search(self, queryset):
        table_queries = []

        for column_name, lookup, term in self.config['filters']:
            column = self.columns[column_name]
            search_f = getattr(
                self, 'search_%s' % (column_name), self.search_column)
            query = search_f(column, term, [lookup])
            if query is not None:
                table_queries.append(query)

        if table_queries:
            query = functools.reduce(operator.and_, table_queries)
            queryset = queryset.filter(query)

        return queryset

    def get_column_value(self, obj, column, **kwargs):
        for source in column.sources:
            if hasattr(source, "__call__"):
                return source(obj)

        return column.value(obj, **kwargs)


def parse_response(datatable):
    return {
        'sEcho': datatable.query_config.get('sEcho', None),
        'iTotalRecords': datatable.total_initial_record_count,
        'iTotalDisplayRecords': datatable.unpaged_record_count,
        'aaData': [dict(record, **{
            'DT_RowId': record.pop('pk'),
            'DT_RowData': record.pop('_extra_data'),
        }) for record in datatable.get_records()],
    }


@python_2_unicode_compatible
class Table(Widget):
    """Datatable that reacts on FilterForm."""
    name = None
    model = None
    columns = None
    filterform = None
    template_name = 'django_data_explorer/table_widget.html'

    def is_accessible(self, request):
        return True

    def get_datatable(self, queryset=(), client_params=None):
        class ModelQuerysetDatatable(QuerysetDatatable):
            class Meta(object):
                model = self.model
                columns = self.columns
                structure_template = "django_data_explorer/datatable_template.html"
        datatable = ModelQuerysetDatatable(queryset, self.endpoint.get_url(),
                                           query_config=client_params)
        return datatable

    def get_queryset(self, dummy):
        return self.model.objects.all()

    def get_data(self, client_params):
        try:
            client_params = json.loads(client_params)
        except ValueError:
            return None
        filter_params = client_params.get('filter_query', {})
        queryset = self.get_queryset(self.params)
        if self.filterform is not None:
            queryset = self.filterform.filter_queryset_query_string(
                filter_params, queryset)

        datatables_params = client_params.get('datatables_params', {})
        datatable = self.get_datatable(queryset, datatables_params)
        datatable.get_records()
        return parse_response(datatable)

    def __str__(self):
        table_data = {
            'containerID': '#' + self.name,
            'formID': '#' + self.filterform.filter_name if self.filterform is not None else "",
            'endpointName': self.name,
            'endpointUrl': self.endpoint.get_url(),
            'table_id': self.name,
            'params': json.dumps(self.params),
        }
        table_text = render_to_string(
            self.template_name, {
                'table_data': json.dumps(table_data),
                'widget_id': self.name
            })
        return mark_safe(table_text + self.render_datatable())

    def render_datatable(self):
        datatable = self.get_datatable()
        smart_text(datatable)  # to make sure it's configured
        context = {
            'url': datatable.url,
            'config': datatable.config,
            'datatable': datatable,
            'columns': datatable.columns.values(),
            'table_id': self.name + '_t'
        }
        datatable_text = render_to_string(
            datatable.config['structure_template'], context)
        return datatable_text
