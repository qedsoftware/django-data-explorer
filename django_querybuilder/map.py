import json

from django.template import Context
from django.template.loader import render_to_string
from django.utils.six import python_2_unicode_compatible


@python_2_unicode_compatible
class Map(object):
    def __init__(self, widget_id, model, filterform=None):
        self.model = model
        self.widget_id = widget_id
        self.latitude = 0
        self.longitude = 0
        self.template_name = "django_querybuilder/map_widget.html"
        self.filterform = filterform

    def filter_data(self, data=None):
        data = data or {}
        if self.filterform == None:
            return self.model.objects.all()
        else:
            return self.filterform.filter_queryset(queryset=self.model.objects.all()) or {}

    def get_endpoint_url(self):
        return "endpoint"

    def __str__(self):
        map_data = {
            'widget_id': self.widget_id,
            'endpoint': self.get_endpoint_url(),
        }
        text = render_to_string(self.template_name, {'map_data': json.dumps(map_data), 'widget_id': self.widget_id})
        return text