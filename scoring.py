from typing import List, Dict

def calculate_recipe_score(available_ingredients: List[str], recipe_ingredients: List[str]) -> float:
    """
    Calculate match score between available ingredients and recipe ingredients
    Args:
        available_ingredients: List of ingredients the user has
        recipe_ingredients: List of ingredients required for the recipe
    Returns:
        score: Float between 0 and 1 indicating match quality
    """
    matching = set(available_ingredients).intersection(set(recipe_ingredients))
    return len(matching) / len(recipe_ingredients)