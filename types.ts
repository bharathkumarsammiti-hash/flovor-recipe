
export interface Ingredient {
  id: number;
  name: string;
}

export interface Recipe {
  id: number;
  title: string;
  instructions: string;
  prep_time_minutes: number;
}

export interface Substitution {
  substitute_ingredient_name: string;
  reason: string;
}

export interface Suggestion {
  recipe: Recipe;
  match_score: number;
  missing_ingredients: Ingredient[];
  substitutions: Substitution[];
}

export interface Insights {
  algorithm: string;
  execution_time_ms: number;
  time_complexity: string;
}

export interface ApiResponse {
  insights: Insights;
  suggestions: Suggestion[];
}

export type AlgorithmMode = 'greedy' | 'backtracking';

export interface ModeInfo {
  id: AlgorithmMode;
  name: string;
  description: string;
}
