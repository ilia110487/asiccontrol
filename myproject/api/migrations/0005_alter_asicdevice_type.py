# Generated by Django 5.1.3 on 2024-11-23 21:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_asicdevice_fan_count'),
    ]

    operations = [
        migrations.AlterField(
            model_name='asicdevice',
            name='type',
            field=models.CharField(choices=[('antminer', 'Antminer'), ('whatsminer', 'Whatsminer')], max_length=20),
        ),
    ]
