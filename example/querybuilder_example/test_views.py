from django.core.urlresolvers import reverse
from django.test import TestCase


class TestCityMapView(TestCase):
    def test_get(self):
        response = self.client.get(reverse("city-map"))
        self.assertIn("map", response.context)
