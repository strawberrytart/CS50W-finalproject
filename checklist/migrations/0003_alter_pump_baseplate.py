# Generated by Django 5.0.1 on 2024-02-07 12:22

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('checklist', '0002_book_alter_pump_checklist'),
    ]

    operations = [
        migrations.AlterField(
            model_name='pump',
            name='baseplate',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='pumps', to='checklist.baseplate'),
        ),
    ]
