import json

from django.template.loader import render_to_string

from .widget import MetaWidget


class MetaMap(MetaWidget):
    """Leaflet map visualizing dataset.

    Can be used in pair with FilterForm.

    By default, the model should have fields latitude and longitude. If it
    doesn't, you should provide functions description_func and coordinates_func.
    Both take a model as a parameter. The first one returns dict {"latitude":
    ..., "longitude" ...}, the other one returns text that will be displayed
    as popup. You can also define this functions to override default behavior.
    """

    def __init__(self, name, model, filterform=None, description_func=None, coordinates_func=None):
        super(MetaMap, self).__init__(name, model)
        self.latitude = 0
        self.longitude = 0
        self.filterform = filterform
        self.template_name = "django_querybuilder/map_widget.html"

        if description_func is None:
            description_func = lambda model: ("Latitude: {}<br>Longitude: {}".format(
                str(model.latitude), str(model.longitude)))
        if coordinates_func is None:
            coordinates_func = lambda model: {'latitude': model.latitude,
                                              'longitude': model.longitude}
        assert hasattr(description_func, '__call__') is True
        self.description_func = description_func
        assert hasattr(coordinates_func, '__call__') is True
        self.coordinates_func = coordinates_func

    def filter_data(self, data=None, queryset=None):
        data = data or {}
        if self.filterform is not None:
            return self.filterform.filter_queryset_query_string(
                data, queryset)
        return queryset

    def get_queryset(self, dummy):
        return self.model.objects.all()

    def get_data(self, endpoint, params, client_params):
        queryset = self.get_queryset(params)
        map_data = self.filter_data(data=client_params, queryset=queryset)
        return self.parse_data(map_data)

    def parse_data(self, data):
        parsed_data = []
        for obj in data:
            dict_obj = {
                'description': self.description_func(obj)
            }
            dict_obj.update(self.coordinates_func(obj))
            parsed_data.append(dict_obj)
        return parsed_data

    def render(self, endpoint, params):
        map_data = {
            'name': self.name,
            'endpoint': endpoint.get_url(),
            'params': json.dumps(params),
            'filter': self.filterform.filter_name if self.filterform is not None else "",
        }
        text = render_to_string(
            self.template_name, {'map_data': json.dumps(map_data),
                                 'name': self.name})
        return text

    def is_accessible(self, params, request):
        return True
