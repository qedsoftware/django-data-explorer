import sys

from django_querybuilder import QuerybuilderEndpoint, TableEndpoint
from django.views.generic import TemplateView

from django_querybuilder import QuerybuilderEndpoint, TableEndpoint
from querybuilder_example.querybuilder import (BasicAuthorTable,
                                               BasicBookTable, CityMap)
from .models import Author, Book
from .querybuilder import BookFilter, CityFilter


class BookTableView(TemplateView):
    template_name = "querybuilder_example/book_table_view.html"

    def get_context_data(self, **kwargs):
        return {
            'book_table': BasicBookTable,
            'author_table': BasicAuthorTable,
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
            'city_filterform': CityFilter,
            'city_map': CityMap,
        }


class PriceDateBookFormView(TemplateView):
    template_name = "querybuilder_example/book_filter_view.html"

    def get_context_data(self, **kwargs):
        return {
            "filterform": BookFilter
        }


class AuthorEndpoint(TableEndpoint):
    model = Author
    datatable_options = {
        'columns': BasicAuthorTable.columns
    }


class BookEndpoint(TableEndpoint):
    model = Book
    datatable_options = {
        'columns': BasicBookTable.columns
    }


class Endpoint(QuerybuilderEndpoint):
    querybuilder = sys.modules['querybuilder_example.querybuilder']
