import { Recipe, Ingredient } from '../types/recipe';

export const getIngredients = (recipe: Recipe): Ingredient[] => {
  const ingredients: Ingredient[] = [];
  
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}` as keyof Recipe] as string;
    const measure = recipe[`strMeasure${i}` as keyof Recipe] as string;
    
    if (ingredient && ingredient.trim()) {
      ingredients.push({
        name: ingredient.trim(),
        measure: measure?.trim() || ''
      });
    }
  }
  
  return ingredients;
};

export const getEstimatedCookingTime = (instructions: string): string => {
  // Simple heuristic based on instruction length and complexity
  const wordCount = instructions.split(' ').length;
  const hasComplexSteps = instructions.toLowerCase().includes('marinate') || 
                         instructions.toLowerCase().includes('overnight') ||
                         instructions.toLowerCase().includes('hours');
  
  if (hasComplexSteps) return '2-3 hours';
  if (wordCount > 200) return '45-60 mins';
  if (wordCount > 100) return '30-45 mins';
  return '15-30 mins';
};