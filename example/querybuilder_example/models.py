from django.db import models


class Author(models.Model):
    name = models.CharField(max_length=100)
    birth_date = models.DateField(null=True)


class Book(models.Model):
    author = models.ForeignKey(Author)
    title = models.CharField(max_length=100)
    pages = models.IntegerField(null=True)
    publication_date = models.DateTimeField(null=True)
