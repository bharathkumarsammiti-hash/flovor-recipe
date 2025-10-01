
import { Ingredient, ModeInfo } from './types';

export const AVAILABLE_INGREDIENTS: Ingredient[] = [
  { id: 1, name: 'Chicken Breast' },
  { id: 2, name: 'Garlic' },
  { id: 3, name: 'Onion' },
  { id: 4, name: 'Tomato' },
  { id: 5, name: 'Pasta' },
  { id: 6, name: 'Olive Oil' },
  { id: 7, name: 'Bell Pepper' },
  { id: 8, name: 'Rice' },
  { id: 9, name: 'Black Beans' },
  { id: 10, name: 'Cheese' },
  { id: 11, name: 'Lettuce' },
  { id: 12, name: 'Ground Beef' },
  { id: 13, name: 'Potatoes' },
  { id: 14, name: 'Carrots' },
  { id: 15, name: 'Eggs' },
  { id: 16, name: 'Flour' },
  { id: 17, name: 'Sugar' },
  { id: 18, name: 'Butter' }
];

export const ALGORITHM_MODES: ModeInfo[] = [
  {
    id: 'backtracking',
    name: 'Exhaustive Search',
    description: 'Finds the absolute best matches, but may be slower.'
  },
  {
    id: 'greedy',
    name: 'Fast Search',
    description: 'Quickly finds good matches, but not always the perfect ones.'
  }
];
