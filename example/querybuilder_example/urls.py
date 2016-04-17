from django.conf.urls import url

from .views import (AuthorEndpoint, BookEndpoint, BookTableView, CityMapView,
                    Endpoint, PriceDateBookFormView, CityMapFilterView)

urlpatterns = [
    url(r'^$', BookTableView.as_view(), name='book-table'),
    url(r'^map/$', CityMapFilterView.as_view(), name='city-map-filter'),
    url(r'^filter/$', PriceDateBookFormView.as_view(), name='book-filter'),
    url(r'^querybuilder-endpoint-author-table/',
        AuthorEndpoint.as_view()),
    url(r'^querybuilder-endpoint-book-table/',
        BookEndpoint.as_view(),
        name="book-endpoint"),
    url(r'^endpoint/', Endpoint.as_view()),
]
