export interface Recipe {
  id: number;
  title: string;
  ingredients: string[];
  instructions: string[];
  region: string;
  type: string;
  image_url: string;
  tags: string[];
  description: string;
  prep_time: number;
  cook_time: number;
  servings: number;
  created_at: string;
}

export interface RecipeFilters {
  region?: string;
  type?: string;
  ingredient?: string;
  tag?: string;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiry: number;
}