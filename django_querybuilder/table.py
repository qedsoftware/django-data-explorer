import operator
import functools
import json

from django.template.loader import render_to_string
from django.utils.encoding import smart_text
from django.utils.six import python_2_unicode_compatible

from datatableview.datatables import LegacyDatatable
from datatableview.exceptions import SkipRecord

from .widget import Widget


class QuerysetDatatable(LegacyDatatable):
    def __init__(self, object_list=(), url='', *args, **kwargs):
        super(QuerysetDatatable, self).__init__(
            object_list, url, *args, **kwargs)
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

    def get_records_list(self):
        return self._records

    def get_all_records(self):
        if not hasattr(self, '_records'):
            self.populate_records()

        page_data = []
        for obj in self._records:
            try:
                record_data = self.get_record_data(obj)
            except SkipRecord:
                pass
            else:
                page_data.append(record_data)
        return page_data


def parse_data(records):
    data = []
    for record in records:
        for attr in ['pk', '_extra_data']:
            record.pop(attr)
        data.append(dict(record))
    return data


@python_2_unicode_compatible
class Table(Widget):
    """Datatable that reacts on FilterForm."""
    def __init__(self, name, model, columns=None, filterform=None):
        """
        :param columns: columns to display, (column header, model field) list
                        all model fields by default
                        supports related field
        """
        self.name = name
        self.model = model
        self.columns = columns
        self.filterform = filterform
        self.template_name = 'django_querybuilder/table_widget.html'

    def full_queryset(self):
        return self.model.objects.all()

    def get_datatable(self, queryset):
        class ModelQuerysetDatatable(QuerysetDatatable):
            class Meta(object):
                model = self.model
                columns = self.columns
                structure_template = "django_querybuilder/datatable_template.html"
        datatable = ModelQuerysetDatatable(queryset, self.get_endpoint_url())
        return datatable

    def get_data(self, parameters):
        queryset = self.full_queryset()
        if self.filterform is not None:
            queryset = self.filterform.filter_queryset_query_string(
                parameters, queryset)
        datatable = self.get_datatable(queryset)
        return parse_data(datatable.get_all_records())

    @staticmethod
    def get_endpoint_url():
        return "/querybuilder/endpoint/"

    def render_datatable(self):
        queryset = self.full_queryset()
        datatable = self.get_datatable(queryset)
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

    def __str__(self):
        table_data = {
            'containerID': '#' + self.name,
            'formID': "#filter" if self.filterform is not None else "",
            'endpointName': self.name,
            'endpointUrl': self.get_endpoint_url(),
            'table_id': self.name,
        }
        table_text = render_to_string(
            self.template_name, {
                'table_data': json.dumps(table_data),
                'widget_id': self.name
            })
        datatable_text = self.render_datatable()
        return table_text + datatable_text
