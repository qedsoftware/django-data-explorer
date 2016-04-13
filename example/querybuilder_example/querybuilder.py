from django_querybuilder import Map, Table

from .models import Author, Book

CityMap = Map(Book)
BasicAuthorTable = Table("author-table", Author)
BasicBookTable = Table("book-table", Book)
