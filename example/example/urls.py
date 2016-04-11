from django.conf.urls import url
from django.contrib import admin

from querybuilder_example import views

urlpatterns = [
    url(r'^$', views.BookTableView.as_view(), name='book-table'),
    url(r'^map/$', views.CityMapView.as_view(), name='city-map'),
    url(r'^admin/', admin.site.urls),
]
