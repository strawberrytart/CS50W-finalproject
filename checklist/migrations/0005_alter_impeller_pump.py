# Generated by Django 5.0.1 on 2024-02-07 12:28

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('checklist', '0004_remove_pump_baseplate_baseplate_pump'),
    ]

    operations = [
        migrations.AlterField(
            model_name='impeller',
            name='pump',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='checklist.pump'),
        ),
    ]