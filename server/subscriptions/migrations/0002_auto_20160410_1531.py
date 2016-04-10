# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('subscriptions', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='braintreeuser',
            name='user',
            field=models.ForeignKey(related_name='braintree_id', to=settings.AUTH_USER_MODEL, unique=True),
            preserve_default=True,
        ),
    ]
