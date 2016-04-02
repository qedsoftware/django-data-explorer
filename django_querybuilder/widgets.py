from datatableview.datatables import Datatable


class Table(Datatable):
    def __init__(self, *args, **kwargs):
        super(Table, self).__init__([], '/', *args, **kwargs)
