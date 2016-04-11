from django.contrib import admin

from querybuilder_example import models


admin.site.register(models.Author)
admin.site.register(models.Book)
admin.site.register(models.City)
