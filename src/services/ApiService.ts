import axios from 'axios';
import { Recipe } from '../types/Recipe';

// Using Spoonacular API for real recipe data
const API_BASE_URL = 'https://api.spoonacular.com/recipes';
const API_KEY = '395734fcd2894b58b7c4e5497457fab2'; // In production, use environment variable

// Backup API endpoints
const BACKUP_API_URL = 'https://www.themealdb.com/api/json/v1/1';

class ApiService {
  private apiKey: string;

  constructor() {
    // In production, this would come from environment variables
    this.apiKey = import.meta.env.VITE_SPOONACULAR_API_KEY || 'demo';
  }

  // Fetch recipes from Spoonacular API
  async fetchRecipesFromSpoonacular(query?: string, cuisine?: string, type?: string): Promise<Recipe[]> {
    try {
      const params = new URLSearchParams({
        apiKey: this.apiKey,
        number: '20',
        addRecipeInformation: 'true',
        fillIngredients: 'true'
      });

      if (query) params.append('query', query);
      if (cuisine) params.append('cuisine', cuisine);
      if (type) params.append('type', type);

      const response = await axios.get(`${API_BASE_URL}/complexSearch`, { params });
      
      return this.transformSpoonacularData(response.data.results);
    } catch (error) {
      console.error('Spoonacular API error:', error);
      return this.fetchFromBackupAPI(query);
    }
  }

  // Backup API using TheMealDB (free, no API key required)
  async fetchFromBackupAPI(query?: string): Promise<Recipe[]> {
    try {
      let url = `${BACKUP_API_URL}/search.php?s=${query || 'chicken'}`;
      
      const response = await axios.get(url);
      
      if (response.data.meals) {
        return this.transformMealDBData(response.data.meals);
      }
      
      return [];
    } catch (error) {
      console.error('Backup API error:', error);
      return [];
    }
  }

  // Fetch recipes by cuisine/region
  async fetchRecipesByCuisine(cuisine: string): Promise<Recipe[]> {
    try {
      const response = await axios.get(`${BACKUP_API_URL}/filter.php?a=${cuisine}`);
      
      if (response.data.meals) {
        // Get detailed info for each recipe
        const detailedRecipes = await Promise.all(
          response.data.meals.slice(0, 12).map(async (meal: any) => {
            const detailResponse = await axios.get(`${BACKUP_API_URL}/lookup.php?i=${meal.idMeal}`);
            return detailResponse.data.meals[0];
          })
        );
        
        return this.transformMealDBData(detailedRecipes);
      }
      
      return [];
    } catch (error) {
      console.error('Cuisine fetch error:', error);
      return [];
    }
  }

  // Fetch recipe by ID
  async fetchRecipeById(id: string): Promise<Recipe | null> {
    try {
      const response = await axios.get(`${BACKUP_API_URL}/lookup.php?i=${id}`);
      
      if (response.data.meals && response.data.meals[0]) {
        const transformed = this.transformMealDBData([response.data.meals[0]]);
        return transformed[0] || null;
      }
      
      return null;
    } catch (error) {
      console.error('Recipe fetch error:', error);
      return null;
    }
  }

  // Search recipes by ingredient
  async searchByIngredient(ingredient: string): Promise<Recipe[]> {
    try {
      const response = await axios.get(`${BACKUP_API_URL}/filter.php?i=${ingredient}`);
      
      if (response.data.meals) {
        // Get detailed info for first 10 recipes
        const detailedRecipes = await Promise.all(
          response.data.meals.slice(0, 10).map(async (meal: any) => {
            const detailResponse = await axios.get(`${BACKUP_API_URL}/lookup.php?i=${meal.idMeal}`);
            return detailResponse.data.meals[0];
          })
        );
        
        return this.transformMealDBData(detailedRecipes);
      }
      
      return [];
    } catch (error) {
      console.error('Ingredient search error:', error);
      return [];
    }
  }

  // Get available cuisines/regions
  async getAvailableCuisines(): Promise<string[]> {
    try {
      const response = await axios.get(`${BACKUP_API_URL}/list.php?a=list`);
      
      if (response.data.meals) {
        return response.data.meals.map((item: any) => item.strArea);
      }
      
      return ['Indian', 'Chinese', 'Italian', 'Mexican', 'Thai', 'French', 'Japanese', 'American'];
    } catch (error) {
      console.error('Cuisines fetch error:', error);
      return ['Indian', 'Chinese', 'Italian', 'Mexican', 'Thai', 'French', 'Japanese', 'American'];
    }
  }

  // Get available categories/types
  async getAvailableCategories(): Promise<string[]> {
    try {
      const response = await axios.get(`${BACKUP_API_URL}/list.php?c=list`);
      
      if (response.data.meals) {
        return response.data.meals.map((item: any) => item.strCategory);
      }
      
      return ['Main Course', 'Dessert', 'Appetizer', 'Side Dish', 'Snack'];
    } catch (error) {
      console.error('Categories fetch error:', error);
      return ['Main Course', 'Dessert', 'Appetizer', 'Side Dish', 'Snack'];
    }
  }

  // Transform Spoonacular data to our Recipe interface
  private transformSpoonacularData(recipes: any[]): Recipe[] {
    return recipes.map((recipe: any) => ({
      id: recipe.id,
      title: recipe.title,
      ingredients: recipe.extendedIngredients?.map((ing: any) => ing.original) || [],
      instructions: recipe.analyzedInstructions?.[0]?.steps?.map((step: any) => step.step) || [],
      region: recipe.cuisines?.[0] || 'International',
      type: recipe.dishTypes?.[0] || 'Main Course',
      image_url: recipe.image || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      tags: [...(recipe.cuisines || []), ...(recipe.dishTypes || []), ...(recipe.diets || [])],
      description: recipe.summary?.replace(/<[^>]*>/g, '').substring(0, 200) + '...' || 'Delicious recipe',
      prep_time: recipe.preparationMinutes || 15,
      cook_time: recipe.cookingMinutes || 30,
      servings: recipe.servings || 4,
      created_at: new Date().toISOString()
    }));
  }

  // Transform MealDB data to our Recipe interface
  private transformMealDBData(meals: any[]): Recipe[] {
    return meals.map((meal: any) => {
      // Extract ingredients from MealDB format
      const ingredients: string[] = [];
      for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient && ingredient.trim()) {
          ingredients.push(`${measure?.trim() || ''} ${ingredient.trim()}`.trim());
        }
      }

      // Split instructions into steps
      const instructions = meal.strInstructions
        ? meal.strInstructions.split(/\r\n|\r|\n/).filter((step: string) => step.trim())
        : [];

      // Generate tags from category and area
      const tags = [
        meal.strCategory?.toLowerCase(),
        meal.strArea?.toLowerCase(),
        ...(meal.strTags ? meal.strTags.split(',').map((tag: string) => tag.trim().toLowerCase()) : [])
      ].filter(Boolean);

      return {
        id: parseInt(meal.idMeal),
        title: meal.strMeal,
        ingredients,
        instructions,
        region: meal.strArea || 'International',
        type: meal.strCategory || 'Main Course',
        image_url: meal.strMealThumb || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
        tags,
        description: `Traditional ${meal.strArea} ${meal.strCategory.toLowerCase()} recipe`,
        prep_time: 20,
        cook_time: 40,
        servings: 4,
        created_at: new Date().toISOString()
      };
    });
  }
}

export const apiService = new ApiService();