from django_querybuilder import Map, Table

from .models import Book


BasicBookTable = Table(Book)
CityMap = Map(Book)
