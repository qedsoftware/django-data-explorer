from django.db import models
from django.utils.six import python_2_unicode_compatible


@python_2_unicode_compatible
class Author(models.Model):
    name = models.CharField(max_length=100)
    birth_date = models.DateField(null=True)

    def __str__(self):
        return '%s, %s' % (self.name, self.birth_date)


@python_2_unicode_compatible
class Book(models.Model):
    author = models.ForeignKey(Author)
    title = models.CharField(max_length=100)
    pages = models.IntegerField(null=True)
    publication_date = models.DateTimeField(null=True)

    def __str__(self):
        return '%s by %s' % (self.title, self.author.name)


@python_2_unicode_compatible
class City(models.Model):
    name = models.CharField(unique=True, max_length=100)
    citizens_number = models.DecimalField(decimal_places=0, max_digits=9)
    latitude = models.DecimalField(decimal_places=6, max_digits=9)
    longitude = models.DecimalField(decimal_places=6, max_digits=9)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "cities"
