from django.conf.urls import url
from django.contrib import admin

from querybuilder_example import views

urlpatterns = [
    url(r'$', views.BookTableView.as_view()),
    url(r'^admin/', admin.site.urls),
]
