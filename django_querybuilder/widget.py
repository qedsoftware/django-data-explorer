class MetaWidget(object):

    def __init__(self, name, model):
        self.name = name
        self.model = model

    def render(self, endpoint, params):
        raise NotImplementedError

    def get_data(self, endpoint, params, client_params):
        raise NotImplementedError
