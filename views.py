from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.http import Http404

from .algorithms.graph_algorithm import find_recipe_matches as graph_finder
from .algorithms.backtracking_algorithm import find_recipe_matches as backtrack_finder
from .algorithms.greedy_algorithm import find_recipe_matches as greedy_finder
from .algorithms.substitutions import suggest_substitutions

# Dummy data for demonstration. Replace with DB query in production.
RECIPES = {
    1: {
        'id': 1,
        'title': 'Spaghetti Carbonara',
        'instructions': 'Boil pasta. Cook bacon. Mix eggs and cheese. Combine all.',
        'prep_time_minutes': 20,
        'all_ingredients': [
            {'id': 1, 'name': 'Spaghetti'},
            {'id': 2, 'name': 'Bacon'},
            {'id': 3, 'name': 'Eggs'},
            {'id': 4, 'name': 'Parmesan'}
        ]
    }
}

ALGORITHM_MAP = {
    'graph': graph_finder,
    'backtracking': backtrack_finder,
    'greedy': greedy_finder
}

@api_view(['GET'])
def get_recipe_detail(request, recipe_id):
    recipe = RECIPES.get(int(recipe_id))
    if not recipe:
        raise Http404('Recipe not found')
    return Response(recipe)

@api_view(['POST'])
def get_recipe_suggestions(request):
    """Get recipe suggestions based on available ingredients"""
    ingredients = request.data.get('ingredients', [])
    algorithm = request.data.get('algorithm', 'graph')
    
    if not ingredients:
        return Response(
            {'error': 'No ingredients provided'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
        
    finder = ALGORITHM_MAP.get(algorithm, graph_finder)
    suggestions = finder(ingredients)
    
    return Response({
        'suggestions': suggestions,
        'algorithm_used': algorithm
    })

@api_view(['POST'])
def get_ingredient_substitutions(request):
    """Get substitution suggestions for missing ingredients"""
    ingredient = request.data.get('ingredient')
    recipe_context = request.data.get('recipe_context', {})
    
    if not ingredient:
        return Response(
            {'error': 'No ingredient provided'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
        
    substitutions = suggest_substitutions(ingredient, recipe_context)
    
    return Response({
        'ingredient': ingredient,
        'substitutions': substitutions
    })