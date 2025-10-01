from typing import Dict, List, Set, Tuple
import networkx as nx

class IngredientGraph:
    def __init__(self):
        self.graph = nx.Graph()
        
    def build_graph(self, recipes: List[Dict]):
        """Build ingredient relationship graph from recipes."""
        for recipe in recipes:
            ingredients = recipe['all_ingredients']
            # Add edges between ingredients that are used together
            for i in range(len(ingredients)):
                for j in range(i + 1, len(ingredients)):
                    ing1, ing2 = ingredients[i]['id'], ingredients[j]['id']
                    if self.graph.has_edge(ing1, ing2):
                        self.graph[ing1][ing2]['weight'] += 1
                    else:
                        self.graph.add_edge(ing1, ing2, weight=1)
    
    def get_common_combinations(self, available_ingredients: List[int]) -> List[Set[int]]:
        """Find common ingredient combinations based on graph weights."""
        combinations = []
        available_set = set(available_ingredients)
        
        # Get subgraph of available ingredients
        subgraph = self.graph.subgraph(available_set)
        
        # Find cliques (groups of ingredients commonly used together)
        for clique in nx.find_cliques(subgraph):
            if len(clique) >= 2:  # Only consider combinations of 2 or more ingredients
                combinations.append(set(clique))
        
        return sorted(combinations, key=len, reverse=True)