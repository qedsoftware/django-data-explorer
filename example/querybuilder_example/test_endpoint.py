import json

from django.test import RequestFactory, TestCase

from . import views
from .models import Author


class EndpointTest(TestCase):

    def setUp(self):
        self.view = views.Endpoint
        self.factory = RequestFactory()

    def test_no_filter(self):
        Author.objects.create(name='name', birth_date='2016-05-23')
        request = self.factory.post('myurl', {'widget_id': 'author-table'})
        response = self.view.as_view()(request)
        content = json.loads(response.content.decode())
        self.assertEqual(content["data"],
                         [{"0": "1", "1": "name", "2": "2016-05-23"}])
