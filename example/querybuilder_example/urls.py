from django.conf.urls import url

from .querybuilder import Endpoint
from . import views

urlpatterns = [
    url(r'^$', views.ExampleList.as_view(), name='widget-list'),
    url(r'^tables/$', views.BookTableView.as_view(), name='book-table'),
    url(r'^map/$', views.CityMapView.as_view(), name='city-map-filter'),
    url(r'^filter/$', views.CityFilterView.as_view(), name='city-filter'),
    url(r'^map_without_filter/$', views.CityMapNoFilterView.as_view(), name='city-map'),
    url(r'^endpoint/', Endpoint.as_view(), name='example-endpoint'),
]
