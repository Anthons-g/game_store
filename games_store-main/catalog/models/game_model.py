from django.db import models

class Game(models.Model):
    name = models.CharField(max_length=255)
    platform = models.CharField(max_length=100)
    genre = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    description = models.TextField()
    image = models.ImageField(upload_to='games_imgs/', null=True, blank=True)
    release_date = models.DateField()
    reviews = models.TextField(blank=True, default='')

    def __str__(self):
        return self.name