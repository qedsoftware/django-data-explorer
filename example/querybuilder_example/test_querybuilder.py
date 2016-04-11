import json
import six

from django.core.urlresolvers import reverse
from django.test import TestCase
from django.utils.encoding import smart_text

from .models import Author, Book
from .querybuilder import BasicBookTable
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
        self.assertEqual(data[0]['2'], "TestBook1")
        self.assertEqual(data[1]['2'], "TestBook2")

    def test_filtered_view(self):
        data = self.get_data_from_response(
            {'filters': 'title;exact;TestBook1'}
        )
        self.assertEqual(len(data), 1)
        self.assertEqual(data[0]['2'], "TestBook1")

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
