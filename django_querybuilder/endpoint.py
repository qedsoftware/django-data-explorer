import json

from django.core.urlresolvers import reverse
from django.http import JsonResponse
from django.utils import six
from django.utils.decorators import method_decorator
from django.utils.encoding import python_2_unicode_compatible
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import View


@python_2_unicode_compatible
class BoundWidget(object):
    def __init__(self, endpoint, unbound_widget, params):
        self.endpoint = endpoint
        self.unbound_widget = unbound_widget
        self.params = params

    def __str__(self):
        return self.unbound_widget.render(self.endpoint, self.params)

    def get_data(self, client_params):
        return self.unbound_widget.get_data(self.endpoint, self.params, client_params)

    def is_accessible(self, request):
        return self.unbound_widget.is_accessible(self.params, request)


class BaseEndpoint(View):
    """JSON view that provides the JavaScript widgets with the access to the
    data.

    You can subclass it in your dedicated querybuilder Python file and set
    field name, so that it matches the name of the view (it will be reversed
    using Django resolvers afterwards).

    Add it to urls.py, as a standard view: YourEndpoint.as_view().

    Add all widgets that you want to support using method register.

    Use dedicated JavaScript QuerybuilderAPI class to make queries.
    POST requests should be of form: {"widget_id": ..., "query_config": ...,
    "params": ...} and return output of widget_class.get_data(endpoint, params,
    client_params).
    """

    name = None
    items = {}

    @method_decorator(csrf_exempt)
    def dispatch(self, *args, **kwargs):
        return super(BaseEndpoint, self).dispatch(*args, **kwargs)  # pylint: disable=no-member

    def post(self, request):
        widget_params = request.POST.get('widget_params')
        if widget_params:
            widget_params = json.loads(widget_params)
        widget_id = request.POST.get('widget_id')
        widget = self.get_widget(widget_id, widget_params)
        if widget is not None:
            if not widget.is_accessible(request):
                return JsonResponse({'status': "FORBIDDEN"}, status=403)
            else:
                data = widget.get_data(request.POST.get('query_config'))
                return JsonResponse({'status': 'OK', 'data': data})
        else:
            return JsonResponse({'status': 'WIDGET_NOT_FOUND'}, status=404)

    @classmethod
    def get_widget(cls, name, params):
        meta_widget = cls.items.get(name)
        if meta_widget is None:
            return None
        return BoundWidget(cls, meta_widget, params)

    @classmethod
    def get_meta_widget_by_id(cls, widget_id):
        return cls.items.get(widget_id)

    @classmethod
    def register(cls, item):
        cls.items[item.name] = item
        return item

    @classmethod
    def get_url(cls):
        return reverse(cls.name)


class EndpointMetaclass(type):
    """Overrides dict, so that each endpoint class has a separate object."""
    def __new__(mcs, name, bases, attrs):
        attrs["items"] = {}
        return super(EndpointMetaclass, mcs).__new__(mcs, name, bases, attrs)


class QuerybuilderEndpoint(six.with_metaclass(EndpointMetaclass, BaseEndpoint)):
    pass
