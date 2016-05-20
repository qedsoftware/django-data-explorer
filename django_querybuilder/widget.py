from django.utils.six import python_2_unicode_compatible


@python_2_unicode_compatible
class Widget(object):

    def __init__(self, endpoint, params):
        self.endpoint = endpoint
        self.params = params

    def __str__(self):
        raise NotImplementedError

    def get_data(self, client_params):
        raise NotImplementedError

    def is_accessible(self, request):
        raise NotImplementedError
