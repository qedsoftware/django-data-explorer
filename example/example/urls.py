from django.conf.urls import include, url
from django.contrib import admin

urlpatterns = [
    url(r'^', include("data_explorer_example.urls")),
    url(r'^admin/', admin.site.urls),
]
