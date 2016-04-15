# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2016-04-15 06:00
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('querybuilder_example', '0003_city'),
    ]

    operations = [
        migrations.AddField(
            model_name='city',
            name='citizens_number',
            field=models.DecimalField(decimal_places=0, default=333, max_digits=9),
            preserve_default=False,
        ),
    ]
