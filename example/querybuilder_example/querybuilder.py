import datetime
from dateutil import relativedelta

from django_querybuilder import FilterForm, Map, Table, QuerybuilderEndpoint

from .models import Author, Book, City


class Endpoint(QuerybuilderEndpoint):
    name = "example-endpoint"


class BookFilter(FilterForm):

    class Meta(object):
        model = Book
        fields = {
            'pages': ['lt', 'gt'],
            'publication_date': ['exact', 'year__gt', 'year'],
        }


class CityFilter(FilterForm):

    def __init__(self, filter_name):
        FilterForm.__init__(self, filter_name)
        self.form.fields['name'].label = "City name is:"

    class Meta(object):
        model = City
        fields = {
            'name': ['exact'],
            'latitude': ['lt'],
            'citizens_number': ['gt'],
        }

CityFilterInstance = CityFilter("city-filter")


def get_age(model):
    delta = relativedelta.relativedelta(datetime.date.today(), model.birth_date)
    return delta.years


@Endpoint.register
class CityMap(Map):
    name = "city-map"
    model = City
    filterform = CityFilterInstance

    @staticmethod
    def description(model):
        return "City %s with latitude %d and longitude %d" % (
            str(model), model.latitude, model.longitude)


@Endpoint.register
class AuthorTable(Table):
    name = "author-table"
    model = Author
    columns = ['name', 'birth_date', ("Age", get_age)]


@Endpoint.register
class BookTable(Table):
    name = "book-table"
    model = Book
    columns = [
        ("Author name", 'author__name'),
        'title',
        'pages',
        'publication_date'
    ]
    filterform = BookFilter("book-filter")
