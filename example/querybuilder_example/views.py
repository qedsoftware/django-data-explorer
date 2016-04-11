from django.views.generic import TemplateView

from querybuilder_example.querybuilder import BasicBookTable, CityMap


class BookTableView(TemplateView):
    template_name = "querybuilder_example/book_table_view.html"

    def get_context_data(self, **kwargs):
        return {
            'table': BasicBookTable
        }


class CityMapView(TemplateView):
    template_name = "querybuilder_example/city_map_view.html"

    def get_context_data(self, **kwargs):
        return {
            "map": CityMap
        }