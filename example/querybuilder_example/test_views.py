from django.core.urlresolvers import reverse
from django.test import TestCase

from .models import City


class TestCityMapView(TestCase):
    def setUp(self):
        self.fakecity1 = City.objects.create(name="City_1", citizens_number=100, latitude=0.01, longitude=51.405)
        self.fakecity2 = City.objects.create(name="City_2", citizens_number=200, latitude=0.21, longitude=51.305)
        self.fakecity3 = City.objects.create(name="City_3", citizens_number=300, latitude=0.11, longitude=51.205)
        self.objects_list = [self.fakecity1, self.fakecity2, self.fakecity3]

    def test_get(self):
        response = self.client.get(reverse("city-map"))
        self.assertIn("map", response.context)
