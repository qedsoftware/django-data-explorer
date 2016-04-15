from django.core import serializers
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

    def __str__(self):
        context = {
            'widget_id': self.widget_id,
            'data': serializers.serialize("json", self.filter_data()),
        }
        text = render_to_string(self.template_name, context)
        return text