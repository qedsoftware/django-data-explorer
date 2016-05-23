from django.views.generic import TemplateView

from querybuilder_example.querybuilder import (CityFilterInstance, Endpoint)


class BookTableView(TemplateView):
    template_name = "querybuilder_example/book_table_view.html"

    def get_context_data(self, **kwargs):
        return {
            'book_table': Endpoint.get_widget("book-table", ()),
            'author_table': Endpoint.get_widget("author-table", ()),
            "filterform": Endpoint.get_widget("book-table", ()).filterform
        }


class CityMapNoFilterView(TemplateView):
    template_name = "querybuilder_example/city_map_view.html"

    def get_context_data(self, **kwargs):
        return {
            "map": Endpoint.get_widget("city-map-nf", ())
        }


class CityMapView(TemplateView):
    template_name = "querybuilder_example/city_map_filter_view.html"

    def get_context_data(self, **kwargs):
        return {
            'city_filterform': Endpoint.get_widget("city-map", ()).filterform,
            'city_map': Endpoint.get_widget("city-map", ()),
        }


class CityFilterView(TemplateView):
    template_name = "querybuilder_example/city_filter_view.html"

    def get_context_data(self, **kwargs):
        return {
            "filterform": CityFilterInstance
        }


class ExampleList(TemplateView):
    template_name = "querybuilder_example/example_list.html"
