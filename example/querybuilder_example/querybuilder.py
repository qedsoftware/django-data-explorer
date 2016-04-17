from django_querybuilder import Map, Table, FilterForm

from .models import Author, Book, City


class BookFilter(FilterForm):
    class Meta:
        model = Book
        fields = {
            'pages': ['lt', 'gt'],
            'publication_date': ['exact', 'year__gt', 'year'],
        }


class CityFilter(FilterForm):

    class Meta:
        model = City
        fields = {
            'name': ['exact'],
        }

CityFilterInstance = CityFilter()
CityMap = Map(widget_id="city-map", model=City, filterform=CityFilterInstance)
BasicAuthorTable = Table("author-table", Author, ['name', 'birth_date'])
BasicBookTable = Table(
    "book-table", Book, [("Author name", 'author__name'),
                         'title',
                         'pages',
                         'publication_date'])
