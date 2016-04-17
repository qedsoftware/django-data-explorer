import datetime
import json
import six

from django.core.urlresolvers import reverse
from django.test import TestCase
from django.utils.encoding import smart_text

from .models import Author, Book
from .querybuilder import BasicBookTable, BookFilter
from .views import BookEndpoint


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
        self._assert_filtered_book_table({}, self.objects_list)

    def test_single_text_filter(self):
        self._assert_filtered_book_table(
            {'filters': 'title;exact;TestBook1'},
            [self.testbook1]
        )
        self._assert_filtered_book_table(
            {'filters': 'title;startswith;TestBook'},
            [self.testbook1, self.testbook2]
        )
        self._assert_filtered_book_table(
            {'filters': 'title;contains;TestBook'},
            self.objects_list
        )

    def test_multiple_filters(self):
        self._assert_filtered_book_table(
            {'filters': 'title;exact;TestBook1,pages;exact;20'},
            [self.testbook1]
        )

    def _assert_filtered_book_table(self, query_config, expected):
        table = BasicBookTable
        records = table.filter_queryset(query_config)
        self.assertEquals(records, expected)


class TableEndpointView(TestCase):
    def setUp(self):
        self.fakeauthor = Author.objects.create(name="FakeAuthor")
        self.testbook1 = Book.objects.create(
            title="TestBook1", pages=20, author=self.fakeauthor)
        self.testbook2 = Book.objects.create(
            title="TestBook2", pages=200, author=self.fakeauthor)
        self.view = BookEndpoint
        self.url = reverse('book-endpoint')

    def test_basic_view(self):
        data = self.get_data_from_response({})
        self.assertEqual(len(data), 2)
        self.assertEqual(data[0]['1'], "TestBook1")
        self.assertEqual(data[1]['1'], "TestBook2")

    def test_filtered_view(self):
        data = self.get_data_from_response(
            {'filters': 'title;exact;TestBook1'}
        )
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['1'], "TestBook1")

    def test_filtered_view_no_results(self):
        data = self.get_data_from_response(
            {'filters': 'title;exact;TestBook1,title;exact;fakefake'}
        )
        self.assertEqual(len(data), 0)

    def get_data_from_response(self, params):
        response = self.client.get(
            self.url, params, HTTP_X_REQUESTED_WITH='XMLHttpRequest')
        content = json.loads(response.content.decode())
        return content["data"]


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
            title="Book_3", author=self.author2, publication_date=datetime.date(2008, 6, 24))

    def test_filter_lt_condition(self):
        filterform = BookFilter()
        filter_data = {'pages__lt': '15'}
        filtered = filterform.filter_queryset(filter_data, Book.objects.all())
        self.assertQuerysetEqual(filtered, ['Book_2'], lambda b: b.title, False)

    def test_filter_no_results(self):
        filterform = BookFilter()
        filter_data = {'pages__gt': '25'}
        filtered = filterform.filter_queryset(filter_data, Book.objects.all())
        self.assertQuerysetEqual(filtered, [], lambda b: b.title, False)

    def test_empty_filter(self):
        filterform = BookFilter()
        filter_data = {}
        filtered = filterform.filter_queryset(filter_data, Book.objects.all())
        self.assertQuerysetEqual(filtered, ['Book_1','Book_2','Book_3'], lambda b: b.title, False)

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
        self.assertQuerysetEqual(filtered, ['Book_3'], lambda b: b.title, False)