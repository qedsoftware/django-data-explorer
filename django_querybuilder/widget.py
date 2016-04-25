from django.utils.six import python_2_unicode_compatible


@python_2_unicode_compatible
class Widget(object):

    def __init__(self, metawidget, widget_params):
        self.metawidget = metawidget
        self.widget_params = widget_params

    def full_queryset(self):
        return self.metawidget.model.objects.all()

    def get_data(self, query_config):
        queryset = self.full_queryset()
        return self.metawidget.get_data(query_config, queryset)

    def __str__(self):
        return self.metawidget.render(self.widget_params)


class MetaWidget(object):
    widget_class = Widget

    def __init__(self, name, model):
        self.name = name
        self.model = model

    def fill(self, widget_params):
        return self.widget_class(self, widget_params)

    def render(self, params):
        raise NotImplementedError

    def get_data(self, dummy, _dummy):
        raise NotImplementedError
