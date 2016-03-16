from django.test import TestCase

import django_querybuilder


class TestExample(TestCase):
    """Example to check if the tests are being run. Remove it when we have
    any real tests.
    """
    def test_fermat_little_theorem(self):
        self.assertEqual(pow(7, 12, 13), 1)

    def test_django_querybuillder_imported(self):
        self.assertIsNotNone(django_querybuilder)
