import json

from django.forms.models import model_to_dict
from django.template.loader import render_to_string
from django.utils.six import python_2_unicode_compatible


@python_2_unicode_compatible
class Map(object):
    def __init__(self, name, model, filterform=None):
        self.model = model
        self.name = name
        self.latitude = 0
        self.longitude = 0
        self.template_name = "django_querybuilder/map_widget.html"
        self.filterform = filterform

    def filter_data(self, data=None):
        data = data or {}
        if self.filterform is None:
            return self.model.objects.all()
        else:
            queryset = self.model.objects.all()
            return self.filterform.filter_queryset(queryset=queryset,
                                                   filter_data=data) or {}

    @staticmethod
    def get_endpoint_url():
        return "endpoint"

    def get_data(self, query_config):
        map_data = self.filter_data(data=query_config)
        return self.parse_data(map_data)

    @staticmethod
    def parse_data(data):
        parsed_data = []
        for obj in data:
            dict_obj = model_to_dict(obj)
            del dict_obj['id']
            parsed_data.append(dict_obj)
        return parsed_data

    def __str__(self):
        map_data = {
            'name': self.name,
            'endpoint': self.get_endpoint_url(),
        }
        text = render_to_string(
            self.template_name, {'map_data': json.dumps(map_data),
                                 'name': self.name})
        return text
