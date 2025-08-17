import { Recipe, RecipeFilters } from '../types/Recipe';
import { Queue, FavoriteSet, SearchHashMap } from '../utils/DataStructures';
import { recipeCache } from '../utils/Cache';
import { apiService } from './ApiService';

class RecipeService {
  private recipes: Recipe[] = [];
  private searchIndex: SearchHashMap = new SearchHashMap();
  private recentViews: Queue<Recipe> = new Queue(10);
  private favorites: FavoriteSet<Recipe> = new FavoriteSet();
  private availableCuisines: string[] = [];
  private availableCategories: string[] = [];

  constructor() {
    this.initializeData();
  }

  private initializeData(): void {
    // Load user preferences from localStorage
    const stored = localStorage.getItem('forgotten-recipes');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        
        // Restore recent views
        if (data.recentViews) {
          data.recentViews.forEach((recipe: Recipe) => this.recentViews.enqueue(recipe));
        }
        
        // Restore favorites
        if (data.favorites) {
          data.favorites.forEach((recipeId: string) => 
            this.favorites.add({ id: parseInt(recipeId) } as Recipe)
          );
        }
      } catch (error) {
        console.error('Error loading stored data:', error);
      }
    }
    
    // Load initial cuisines and categories
    this.loadMetadata();
  }

  private async loadMetadata(): Promise<void> {
    try {
      this.availableCuisines = await apiService.getAvailableCuisines();
      this.availableCategories = await apiService.getAvailableCategories();
    } catch (error) {
      console.error('Error loading metadata:', error);
    }
  }

  private saveToStorage(): void {
    const data = {
      recentViews: this.recentViews.toArray(),
      favorites: this.favorites.toArray()
    };
    localStorage.setItem('forgotten-recipes', JSON.stringify(data));
  }

  // CRUD Operations (simulating REST API)
  
  async getAllRecipes(): Promise<Recipe[]> {
    const cacheKey = 'all-recipes';
    let recipes = recipeCache.get<Recipe[]>(cacheKey);
    
    if (!recipes) {
      try {
        // Fetch from multiple cuisines to get diverse recipes
        const cuisinePromises = ['Indian', 'Chinese', 'Italian'].map(cuisine => 
          apiService.fetchRecipesByCuisine(cuisine)
        );
        
        const cuisineResults = await Promise.all(cuisinePromises);
        recipes = cuisineResults.flat();
        
        // Update local recipes and search index
        this.recipes = recipes;
        this.searchIndex.buildIndex(this.recipes);
        
        recipeCache.set(cacheKey, recipes, 10 * 60 * 1000); // 10 minutes TTL
      } catch (error) {
        console.error('Error fetching recipes:', error);
        recipes = [];
      }
    }
    
    return recipes;
  }

  async getRecipeById(id: number): Promise<Recipe | null> {
    const cacheKey = `recipe-${id}`;
    let recipe = recipeCache.get<Recipe>(cacheKey);
    
    if (!recipe) {
      try {
        recipe = await apiService.fetchRecipeById(id.toString());
      } catch (error) {
        console.error('Error fetching recipe:', error);
        recipe = null;
      }
      
      if (recipe) {
        recipeCache.set(cacheKey, recipe);
        // Add to recent views
        this.recentViews.enqueue(recipe);
        this.saveToStorage();
      }
    }
    
    return recipe;
  }

  // Advanced Search with Data Structures
  async searchRecipes(filters: RecipeFilters, query?: string): Promise<Recipe[]> {
    const cacheKey = `search-${JSON.stringify(filters)}-${query || ''}`;
    let results = recipeCache.get<Recipe[]>(cacheKey);
    
    if (!results) {
      try {
        // If we have a specific search query, use API search
        if (query) {
          results = await apiService.fetchRecipesFromSpoonacular(query, filters.region, filters.type);
        } else if (filters.ingredient) {
          results = await apiService.searchByIngredient(filters.ingredient);
        } else if (filters.region) {
          results = await apiService.fetchRecipesByCuisine(filters.region);
        } else {
          // Use cached recipes and apply local filtering
          const allRecipes = await this.getAllRecipes();
          results = this.applyLocalFilters(allRecipes, filters);
        }
        
        recipeCache.set(cacheKey, results, 5 * 60 * 1000); // 5 minutes TTL for searches
      } catch (error) {
        console.error('Error searching recipes:', error);
        results = [];
      }
    }
    
    return results;
  }

  private applyLocalFilters(recipes: Recipe[], filters: RecipeFilters): Recipe[] {
    return recipes.filter(recipe => {
      if (filters.region && recipe.region !== filters.region) return false;
      if (filters.type && recipe.type !== filters.type) return false;
      if (filters.tag && !recipe.tags.includes(filters.tag)) return false;
      if (filters.ingredient) {
        const hasIngredient = recipe.ingredients.some(ingredient =>
          ingredient.toLowerCase().includes(filters.ingredient!.toLowerCase())
        );
        if (!hasIngredient) return false;
      }
      return true;
    });
  }

  // Recent Views Management
  getRecentViews(): Recipe[] {
    return this.recentViews.toArray();
  }

  clearRecentViews(): void {
    this.recentViews.clear();
    this.saveToStorage();
  }

  // Favorites Management
  toggleFavorite(recipe: Recipe): boolean {
    const isFavorite = this.favorites.has(recipe);
    if (isFavorite) {
      this.favorites.remove(recipe);
    } else {
      this.favorites.add(recipe);
    }
    this.saveToStorage();
    return !isFavorite;
  }

  isFavorite(recipe: Recipe): boolean {
    return this.favorites.has(recipe);
  }

  getFavorites(): Recipe[] {
    const favoriteIds = this.favorites.toArray().map(id => parseInt(id));
    // For favorites, we need to fetch from API or use cached data
    const cachedRecipes = recipeCache.get<Recipe[]>('all-recipes') || [];
    return cachedRecipes.filter(recipe => favoriteIds.includes(recipe.id));
  }

  // Get unique values for filters
  getRegions(): string[] {
    return this.availableCuisines.length > 0 ? this.availableCuisines : 
           ['Indian', 'Chinese', 'Italian', 'Mexican', 'Thai', 'French', 'Japanese'];
  }

  getTypes(): string[] {
    return this.availableCategories.length > 0 ? this.availableCategories :
           ['Main Course', 'Dessert', 'Appetizer', 'Side Dish', 'Snack'];
  }

  getTags(): string[] {
    const cachedRecipes = recipeCache.get<Recipe[]>('all-recipes') || [];
    const allTags = cachedRecipes.flatMap(r => r.tags);
    return Array.from(new Set(allTags)).sort();
  }

  // Performance monitoring
  getCacheStats() {
    return recipeCache.getStats();
  }

  // Memory optimization
  cleanupCache(): void {
    recipeCache.cleanup();
  }
}

export const recipeService = new RecipeService();