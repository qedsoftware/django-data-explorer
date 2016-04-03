import operator
from functools import reduce

from datatableview.datatables import Datatable


class QuerysetDatatable(Datatable):
    def __init__(self, object_list=[], url='/', *args, **kwargs):
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

    def normalize_config_filters(self, config, query_config):
        filters = []
        for column_name, lookup, term in query_config.get('filters', ''):
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
            q = search_f(column, term, [lookup])
            if q is not None:
                table_queries.append(q)

        if table_queries:
            q = reduce(operator.and_, table_queries)
            queryset = queryset.filter(q)

        return queryset


class Table:
    def __init__(self, model=None):
        self.model = model

    def filter_queryset(self, query_config):
        class ModelQuerysetDatatable(QuerysetDatatable):
            class Meta:
                model = self.model
        datatable = ModelQuerysetDatatable(
            self.model.objects.all(), "/", query_config=query_config)
        datatable.populate_records()
        return list(datatable._records)
