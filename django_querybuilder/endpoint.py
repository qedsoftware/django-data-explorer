from django.http import JsonResponse
from django.views.generic import View

from .table import Table


class QuerybuilderEndpoint(View):
    querybuilder = None

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
            except TypeError:
                continue
        return None
