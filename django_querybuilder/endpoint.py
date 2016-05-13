import json

from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import View

from .widget import MetaWidget


class QuerybuilderEndpoint(View):
    """JSON view that enables the widgets access to database.

    Field querybuilder is module, where fields are looked up.

    Add it to urls.py, as a standard view: QuerybuilderEndpoint().as_view().


    POST requests should be of form: {"widget_id": ..., "query_config": ...}
    and returns output of widget.get_data(query_config).
    """
    querybuilder = None

    @method_decorator(csrf_exempt)
    def dispatch(self, *args, **kwargs):
        return super(QuerybuilderEndpoint, self).dispatch(*args, **kwargs) # pylint: disable=no-member

    @method_decorator(csrf_exempt)
    def post(self, request):
        widget_params = request.POST.get('widget_params')
        if widget_params:
            widget_params = json.loads(widget_params)
        meta_widget = self.get_meta_widget_by_id(request.POST.get('widget_id'))
        if meta_widget is not None:
            widget = meta_widget.fill(widget_params)
            data = widget.get_data(request.POST.get('query_config'))
            return JsonResponse({'status': 'OK', 'data': data})

        return JsonResponse({'status': 'WIDGET_NOT_FOUND'})

    def get_meta_widget_by_id(self, widget_id):
        for attribute_name in dir(self.querybuilder):
            Item = getattr(self.querybuilder, attribute_name)
            try:
                if isinstance(Item, MetaWidget) and Item.name == widget_id:
                    return Item
            except TypeError:
                continue
        return None
