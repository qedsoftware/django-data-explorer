from datatableview.views.legacy import LegacyDatatableView
from .table import parse_data, QuerysetDatatable


class TableEndpoint(LegacyDatatableView):
    datatable_class = QuerysetDatatable

    def get_json_response_object(self, datatable):
        datatable.populate_records()

        response_data = {
            'sEcho': self.request.GET.get('sEcho', None),
            'iTotalRecords': datatable.total_initial_record_count,
            'iTotalDisplayRecords': datatable.unpaged_record_count,
            'data': parse_data(datatable.get_records()),
        }
        return response_data
