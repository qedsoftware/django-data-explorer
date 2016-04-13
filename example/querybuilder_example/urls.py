from django.conf.urls import url
from .views import AuthorEndpoint, BookEndpoint, BookTableView, CityMapView

urlpatterns = [
    url(r'^$', BookTableView.as_view(), name='book-table'),
    url(r'^map/$', CityMapView.as_view(), name='city-map'),
    url(r'^querybuilder-endpoint-author-table/',
        AuthorEndpoint.as_view()),
    url(r'^querybuilder-endpoint-book-table/',
        BookEndpoint.as_view(),
        name="book-endpoint"),
]
