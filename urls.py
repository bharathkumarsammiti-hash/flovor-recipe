from django.urls import path
from .views import get_recipe_detail, get_recipe_suggestions, get_ingredient_substitutions

urlpatterns = [
    path('recipe/<int:recipe_id>/', get_recipe_detail, name='recipe-detail'),
    path('suggestions/', get_recipe_suggestions, name='recipe-suggestions'),
    path('substitutions/', get_ingredient_substitutions, name='ingredient-substitutions'),
]
