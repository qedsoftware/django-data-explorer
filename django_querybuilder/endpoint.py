from django.http import JsonResponse
from django.views.generic import View

from .table import Table


class QuerybuilderEndpoint(View):
    querybuilder = None

    def post(self, request):
        for attribute_name in dir(self.querybuilder):
            Item = getattr(self.querybuilder, attribute_name)
            try:
                is_table = isinstance(Item, Table) and Item is not Table
            except TypeError:
                continue
            if is_table:
                if Item.name == request.POST.get('widget_id'):
                    return Item.get_data(request.POST.get('query_config'))
        return JsonResponse({'data': ''})
