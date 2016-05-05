import datetime

import mock
from django.test import TestCase
from django.utils.encoding import smart_text

import django_querybuilder

from .models import Author, Book, City
from .querybuilder import BasicBookTable, BookFilter, CityMap


class TableFiltersTestCase(TestCase):
    def setUp(self):
        self.fakeauthor = Author.objects.create(name="FakeAuthor")
        self.fakeauthor2 = Author.objects.create(name="FakeAuthor2")
        self.testbook1 = Book.objects.create(
            title="TestBook1", pages=20, author=self.fakeauthor)
        self.testbook2 = Book.objects.create(
            title="TestBook2", author=self.fakeauthor, pages=10)
        self.nontestbook = Book.objects.create(
            title="nonTestBook", author=self.fakeauthor2)
        self.objects_list = [self.testbook1, self.testbook2, self.nontestbook]

    def test_no_filters(self):
        records = BasicBookTable.get_data("")
        self.assertEqual(len(records), 3)

    def test_single_text_filter(self):
        records = BasicBookTable.get_data("pages__gt=19")
        self.assertEqual(len(records), 1)

    def test_many_records(self):
        PAGE_DEFAULT = 25
        for _ in range(PAGE_DEFAULT):
            Book.objects.create(title="Book", author=self.fakeauthor)
        records = BasicBookTable.get_data("")
        self.assertEqual(len(records), PAGE_DEFAULT + 3)



class TableStrRepresentation(TestCase):
    def test_str(self):
        text = smart_text(BasicBookTable)
        self.assertIn("Title", text)


class FilterFormTestCase(TestCase):
    def setUp(self):
        self.author1 = Author.objects.create(name="Author_1")
        self.author2 = Author.objects.create(name="Author_2")
        self.testbook1 = Book.objects.create(
            title="Book_1", pages=20, author=self.author1)
        self.testbook2 = Book.objects.create(
            title="Book_2", author=self.author2, pages=10)
        self.testbook3 = Book.objects.create(
            title="Book_3", author=self.author2,
            publication_date=datetime.date(2008, 6, 24))

    def test_filter_lt_condition(self):
        filterform = BookFilter()
        filter_data = {'pages__lt': '15'}
        filtered = filterform.filter_queryset(filter_data, Book.objects.all())
        self.assertQuerysetEqual(
            filtered, ['Book_2'], lambda b: b.title, False)

    def test_filter_no_results(self):
        filterform = BookFilter()
        filter_data = {'pages__gt': '25'}
        filtered = filterform.filter_queryset(filter_data, Book.objects.all())
        self.assertQuerysetEqual(filtered, [], lambda b: b.title, False)

    def test_empty_filter(self):
        filterform = BookFilter()
        filter_data = {}
        filtered = filterform.filter_queryset(filter_data, Book.objects.all())
        self.assertQuerysetEqual(
            filtered, ['Book_1', 'Book_2', 'Book_3'], lambda b: b.title, False)

    def test_excluding_filter(self):
        filterform = BookFilter()
        filter_data = {
            'pages__gt': 15,
            'pages__lt': 14,
        }
        filtered = filterform.filter_queryset(filter_data, Book.objects.all())
        self.assertQuerysetEqual(filtered, [], lambda b: b.title, False)

    def test_filter_exact(self):
        filterform = BookFilter()
        filter_data = {
            'publication_date': '2008-06-24',
            'publication_date__year': 2008,
        }
        filtered = filterform.filter_queryset(filter_data, Book.objects.all())
        self.assertQuerysetEqual(
            filtered, ['Book_3'], lambda b: b.title, False)

    @mock.patch("django_querybuilder.FilterForm.filter_queryset")
    def test_filter_queryset_query_string(self, filter_queryset_mock):
        filterform = BookFilter()
        filterform.filter_queryset_query_string("a=b&c=d", "queryset here")
        parsed = filter_queryset_mock.call_args[0][0]
        self.assertEqual(parsed, {"a": ["b"], "c": ["d"]})


class MapGetDataTestCase(TestCase):
    def setUp(self):
        self.city1 = City.objects.create(name="City_1", citizens_number=3,
                                         latitude=30.0, longitude=20.0)
        self.city2 = City.objects.create(name="City_2", citizens_number=33,
                                         latitude=33.0, longitude=21.0)
        self.city3 = City.objects.create(name="City_3", citizens_number=333,
                                         latitude=35.0, longitude=22.0)

    def test_get_all_data(self):
        city_map = CityMap
        query_config = {}
        data = city_map.get_data(query_config)
        self.assertEqual(data, [
            {'description': "City City_1 with latitude 30 " +
                            "and longitude 20",
             'latitude': 30.0, 'longitude': 20.0},
            {'description': "City City_2 with latitude 33 " +
                            "and longitude 21",
             'latitude': 33.0, 'longitude': 21.0},
            {'description': "City City_3 with latitude 35 " +
                            "and longitude 22",
             'latitude': 35.0, 'longitude': 22.0}])

    def test_get_some_data(self):
        city_map = CityMap
        query_config = 'citizens_number__gt=30&latitude__lt=34.0'
        data = city_map.get_data(query_config)
        self.assertEqual(data[0]['latitude'], 33.0)

    def test_get_no_data(self):
        city_map = CityMap
        query_config = 'citizens_number__gt=30&latitude__lt=20.0'
        data = city_map.get_data(query_config)
        self.assertEqual(data, [])

    @staticmethod
    def test_map_no_descr():
        """Make sure that the constructor works for maps without descriptions.
        """
        django_querybuilder.Widget("nonexistent", City)
