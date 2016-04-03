from django.test import TestCase

from .models import Author, Book
from .querybuilder import BasicBookTable, EmptyTable


class TableTestCase(TestCase):
    def test_empty(self):
        table = EmptyTable
        self.assertIsNotNone(table)


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
            {'filters': [('title', 'exact', 'TestBook1')]},
            [self.testbook1]
        )
        self._assert_filtered_book_table(
            {'filters': [('title', 'startswith', 'TestBook')]},
            [self.testbook1, self.testbook2]
        )
        self._assert_filtered_book_table(
            {'filters': [('title', 'contains', 'TestBook')]},
            self.objects_list
        )

    def test_multiple_filters(self):
        self._assert_filtered_book_table(
            {'filters': [
                ('title', 'exact', 'TestBook1'),
                ('pages', 'exact', '20')
            ]},
            [self.testbook1]
        )

    def _assert_filtered_book_table(self, query_config, expected):
        table = BasicBookTable
        records = table.filter_queryset(query_config)
        self.assertEquals(records, expected)
