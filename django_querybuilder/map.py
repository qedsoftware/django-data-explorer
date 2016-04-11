from django.utils.six import python_2_unicode_compatible


@python_2_unicode_compatible
class Map(object):
    def __init__(self, model):
        self.model = model

    def __str__(self):
        return "Looks like a map, doesn't it?"
