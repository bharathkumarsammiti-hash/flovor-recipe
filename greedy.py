from typing import List, Dict, Set
import numpy as np
from collections import defaultdict

class GreedyMatcher:
    def __init__(self, recipes: List[Dict], all_ingredients: List[Dict]):
        self.recipes = recipes
        self.ingredient_map = {ing['id']: ing for ing in all_ingredients}
        self.substitutions = self._build_substitution_map(all_ingredients)
    
    def _build_substitution_map(self, ingredients: List[Dict]) -> Dict:
        """Build a map of possible ingredient substitutions based on categories."""
        substitutions = defaultdict(list)
        # Group ingredients by category/type for substitution suggestions
        categories = defaultdict(list)
        
        for ing in ingredients:
            if 'category' in ing:
                categories[ing['category']].append(ing)
        
        # Create substitution pairs within same category
        for category, items in categories.items():
            for item in items:
                others = [x for x in items if x['id'] != item['id']]
                substitutions[item['id']] = others
        
        return substitutions
    
    def find_recipes_greedy(self, available_ingredients: Set[int], k: int = 5) -> List[Dict]:
        """
        Greedily find the k best recipe matches based on available ingredients.
        Also suggests ingredient substitutions.
        """
        matches = []
        available_set = set(available_ingredients)
        
        for recipe in self.recipes:
            recipe_ingredients = {ing['id'] for ing in recipe['all_ingredients']}
            match_score = len(available_set & recipe_ingredients) / len(recipe_ingredients)
            
            if match_score > 0:  # Consider any recipe with at least one matching ingredient
                missing_ingredients = recipe_ingredients - available_set
                substitutions = []
                
                # Find possible substitutions for missing ingredients
                for missing_id in missing_ingredients:
                    if missing_id in self.substitutions:
                        possible_subs = [
                            sub for sub in self.substitutions[missing_id] 
                            if sub['id'] in available_set
                        ]
                        if possible_subs:
                            sub = possible_subs[0]  # Take the first available substitution
                            substitutions.append({
                                'missing_ingredient_id': missing_id,
                                'substitute_ingredient_name': sub['name'],
                                'reason': f"Similar {self.ingredient_map[missing_id].get('category', 'ingredient')}"
                            })
                
                matches.append({
                    'recipe': recipe,
                    'match_score': match_score,
                    'missing_ingredients': [
                        self.ingredient_map[ing_id] 
                        for ing_id in missing_ingredients
                    ],
                    'substitutions': substitutions
                })
        
        # Sort by match score and number of possible substitutions
        return sorted(
            matches,
            key=lambda x: (x['match_score'], len(x['substitutions'])),
            reverse=True
        )[:k]