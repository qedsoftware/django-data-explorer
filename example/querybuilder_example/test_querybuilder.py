from django.test import TestCase
from .querybuilder import EmptyTable


class TableTestCase(TestCase):
    def test_empty(self):
        table = EmptyTable()
        self.assertIsNotNone(table)
