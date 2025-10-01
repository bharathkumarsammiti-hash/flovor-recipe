from typing import List, Dict, Set
from collections import defaultdict

class RecipeBacktracker:
    def __init__(self, recipes: List[Dict], all_ingredients: List[Dict]):
        self.recipes = recipes
        self.ingredient_map = {ing['id']: ing for ing in all_ingredients}
        self.best_matches = []
        self.max_matches = 0
    
    def find_best_recipes(self, available_ingredients: Set[int], k: int = 5) -> List[Dict]:
        """
        Find the k best recipes using backtracking.
        Returns recipes sorted by match score and minimizes missing ingredients.
        """
        self.best_matches = []
        self.max_matches = 0
        available_set = set(available_ingredients)
        
        def backtrack(recipe_idx: int, current_matches: List[Dict], used_ingredients: Set[int]):
            if recipe_idx == len(self.recipes):
                if len(current_matches) > self.max_matches:
                    self.max_matches = len(current_matches)
                    self.best_matches = current_matches.copy()
                return
            
            current_recipe = self.recipes[recipe_idx]
            recipe_ingredients = {ing['id'] for ing in current_recipe['all_ingredients']}
            
            # Calculate match score
            available_for_recipe = available_set & recipe_ingredients
            match_score = len(available_for_recipe) / len(recipe_ingredients)
            
            # Try including this recipe if it has a good match score
            if match_score >= 0.5 and not (used_ingredients & recipe_ingredients):
                current_matches.append({
                    'recipe': current_recipe,
                    'match_score': match_score,
                    'missing_ingredients': [
                        self.ingredient_map[ing_id] 
                        for ing_id in recipe_ingredients - available_set
                    ]
                })
                backtrack(recipe_idx + 1, current_matches, used_ingredients | recipe_ingredients)
                current_matches.pop()
            
            # Try skipping this recipe
            backtrack(recipe_idx + 1, current_matches, used_ingredients)
        
        backtrack(0, [], set())
        return sorted(
            self.best_matches,
            key=lambda x: (x['match_score'], -len(x['missing_ingredients'])),
            reverse=True
        )[:k]