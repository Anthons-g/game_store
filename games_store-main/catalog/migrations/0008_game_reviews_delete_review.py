# Generated by Django 5.1.1 on 2024-10-11 15:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('catalog', '0007_remove_game_reviews_review'),
    ]

    operations = [
        migrations.AddField(
            model_name='game',
            name='reviews',
            field=models.TextField(blank=True, default=''),
        ),
        migrations.DeleteModel(
            name='Review',
        ),
    ]
