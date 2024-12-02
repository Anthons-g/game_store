from django.shortcuts import render
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from catalog.models import Game

def list_games(request):
    games = Game.objects.all()
    return render(request, 'catalog/list_games.html', {'games': games})

def game_details(request, game_id):
    game = get_object_or_404(Game, id=game_id)

    if request.headers.get('x-requested-with') == 'XMLHttpRequest':
        game_data = {
            'name': game.name,
            'genre': game.genre,
            'platform': game.platform,
            'price': game.price,
            'description': game.description,
            'release_date': game.release_date.strftime('%B %d, %Y'),
            'reviews': game.reviews,
            'image_url': game.image.url
        }
        return JsonResponse(game_data)

def filter_games(request):
    print(request.GET)
    search = request.GET.get('search')
    platform = request.GET.get('platform', '')
    genre = request.GET.get('genre', '')
    min_price = request.GET.get('min_price', '')
    max_price = request.GET.get('max_price', '')
    order_by_price = request.GET.get('order_by_price')
    
    games = Game.objects.all()

    if search:
        games = games.filter(name__icontains=search)
    if platform:
        games = games.filter(platform__icontains=platform)
    if genre:
        games = games.filter(genre__icontains=genre)

    if min_price:
        games = games.filter(price__gte=min_price)
    if max_price:
        games = games.filter(price__lte=max_price)

    if order_by_price == 'asc':
        games = games.order_by('price') 
    elif order_by_price == 'desc':
        games = games.order_by('-price')

    if request.headers.get('x-requested-with') == 'XMLHttpRequest':  
        games_list = [
            {
                'id': game.id,
                'name': game.name,
                'platform': game.platform,
                'genre': game.genre,
                'price': game.price,
                'image_url': game.image.url,
            }
            for game in games
        ]
        return JsonResponse({'games': games_list})

    return render(request, 'games/catalog.html', {'games': games})
