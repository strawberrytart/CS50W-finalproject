# Generated by Django 5.0.1 on 2024-02-07 13:35

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('checklist', '0006_alter_baseplate_pump_alter_impeller_pump'),
    ]

    operations = [
        migrations.AddField(
            model_name='qualitycheck',
            name='pump',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='qualitycheck', to='checklist.pump'),
        ),
    ]