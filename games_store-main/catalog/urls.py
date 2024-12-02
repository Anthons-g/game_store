from django.urls import path
from catalog.views import catalog_view

urlpatterns = [
    path('', catalog_view.list_games, name='list_games'),
    path('game/<int:game_id>/', catalog_view.game_details, name='game_details'),
    path('filter/', catalog_view.filter_games, name='filter_games'),
]
