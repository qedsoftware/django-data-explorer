from django_querybuilder import Table

from .models import Book


EmptyTable = Table()
BasicBookTable = Table(Book)
