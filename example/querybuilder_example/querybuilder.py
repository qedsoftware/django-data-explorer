import datetime
from dateutil import relativedelta

from django_querybuilder import FilterForm, MetaMap, MetaTable, Widget

from .models import Author, Book, City


class BookFilter(FilterForm):

    class Meta(object):
        model = Book
        fields = {
            'pages': ['lt', 'gt'],
            'publication_date': ['exact', 'year__gt', 'year'],
        }


class CityFilter(FilterForm):

    class Meta(object):
        model = City
        fields = {
            'name': ['exact'],
            'latitude': ['lt'],
            'citizens_number': ['gt'],
        }

def city_description_function(model):
    return "City %s with latitude %d and longitude %d" % (str(model), model.latitude,
                                                          model.longitude)


CityFilterInstance = CityFilter("city-filter")

def get_age(model):
    delta = relativedelta.relativedelta(datetime.date.today(), model.birth_date)
    return delta.years

CityMetaMap = MetaMap(name="city-map", model=City, filterform=CityFilterInstance,
                      description_func=city_description_function)
CityMap = Widget(CityMetaMap, {})
BasicAuthorMetaTable = MetaTable("author-table", Author,
                                 columns=['name', 'birth_date', ("Age", get_age)])
BasicBookMetaTable = MetaTable(
    "book-table", Book, columns=[
        ("Author name", 'author__name'),
        'title',
        'pages',
        'publication_date'], filterform=BookFilter("book-filter"))
BasicAuthorTable = Widget(BasicAuthorMetaTable, {})
BasicBookTable = Widget(BasicBookMetaTable, {})
