from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import View

from .map import Map
from .table import Table


class QuerybuilderEndpoint(View):
    querybuilder = None

    @method_decorator(csrf_exempt)
    def dispatch(self, *args, **kwargs):
        return super(QuerybuilderEndpoint, self).dispatch(*args, **kwargs) # pylint: disable=no-member

    def post(self, request):
        widget = self.get_widget_by_id(request.POST.get('widget_id'))
        if widget:
            data = widget.get_data(request.POST.get('query_config'))
            return JsonResponse({'status': 'OK', 'data': data})

        return JsonResponse({'status': 'WIDGET_NOT_FOUND'})

    def get_widget_by_id(self, widget_id):
        for attribute_name in dir(self.querybuilder):
            Item = getattr(self.querybuilder, attribute_name)
            try:
                if isinstance(Item, Table) and Item.name == widget_id:
                    return Item
                if isinstance(Item, Map) and Item.name == widget_id:
                    return Item
            except TypeError:
                continue
        return None
