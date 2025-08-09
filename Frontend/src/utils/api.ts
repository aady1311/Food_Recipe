import { ApiResponse, Recipe } from '../types/recipe';

const API_BASE_URL = 'https://api.freeapi.app/api/v1/public/meals';

export const fetchRecipes = async (page: number = 1, limit: number = 10): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}?page=${page}&limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch recipes');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
};

export const fetchRecipeById = async (id: string): Promise<Recipe | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch recipe details');
    }
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    return null;
  }
};