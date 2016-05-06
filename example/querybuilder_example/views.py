import sys

from django.views.generic import TemplateView

from django_querybuilder import QuerybuilderEndpoint
from querybuilder_example.querybuilder import (BasicAuthorTable, CityFilterInstance,
                                               BasicBookTable, CityMap)


class BookTableView(TemplateView):
    template_name = "querybuilder_example/book_table_view.html"

    def get_context_data(self, **kwargs):
        return {
            'book_table': BasicBookTable,
            'author_table': BasicAuthorTable,
            "filterform": BasicBookTable.metawidget.filterform
        }


class CityMapView(TemplateView):
    template_name = "querybuilder_example/city_map_view.html"

    def get_context_data(self, **kwargs):
        return {
            "map": CityMap
        }


class CityMapFilterView(TemplateView):
    template_name = "querybuilder_example/city_map_filter_view.html"

    def get_context_data(self, **kwargs):
        return {
            'city_filterform': CityMap.metawidget.filterform,
            'city_map': CityMap,
        }


class CityFilterView(TemplateView):
    template_name = "querybuilder_example/city_filter_view.html"

    def get_context_data(self, **kwargs):
        return {
            "filterform": CityFilterInstance
        }


class Endpoint(QuerybuilderEndpoint):
    querybuilder = sys.modules['querybuilder_example.querybuilder']
