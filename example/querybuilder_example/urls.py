from django.conf.urls import url

from .views import (BookTableView, Endpoint, CityFilterView, CityMapView,
                    CityMapFilterView)

urlpatterns = [
    url(r'^$', BookTableView.as_view(), name='book-table'),
    url(r'^map/$', CityMapFilterView.as_view(), name='city-map-filter'),
    url(r'^filter/$', CityFilterView.as_view(), name='city-filter'),
    url(r'^map_without_filter/$', CityMapView.as_view(), name='city-map'),
    url(r'^endpoint/', Endpoint.as_view()),
]
