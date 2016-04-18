from django_querybuilder import Map, Table, FilterForm

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

CityFilterInstance = CityFilter()
CityMap = Map(name="city-map", model=City, filterform=CityFilterInstance,
              description_func=city_description_function)
BasicAuthorTable = Table("author-table", Author, ['name', 'birth_date'])
BasicBookTable = Table(
    "book-table", Book, [("Author name", 'author__name'),
                         'title',
                         'pages',
                         'publication_date'])
