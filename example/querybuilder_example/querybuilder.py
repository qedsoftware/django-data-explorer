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

CityFilterInstance = CityFilter()
CityMap = Map(name="city-map", model=City, filterform=CityFilterInstance)
BasicAuthorTable = Table("author-table", Author, ['name', 'birth_date'])
BasicBookTable = Table(
    "book-table", Book, [("Author name", 'author__name'),
                         'title',
                         'pages',
                         'publication_date'])
