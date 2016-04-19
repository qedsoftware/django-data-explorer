from django.conf.urls import url

from .views import (BookTableView,
                    Endpoint, PriceDateBookFormView, CityMapFilterView)

urlpatterns = [
    url(r'^$', BookTableView.as_view(), name='book-table'),
    url(r'^map/$', CityMapFilterView.as_view(), name='city-map-filter'),
    url(r'^filter/$', PriceDateBookFormView.as_view(), name='book-filter'),
    url(r'^endpoint/', Endpoint.as_view()),
]
