import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Users, Youtube, ExternalLink } from 'lucide-react';
import { Recipe } from '../types/recipe';
import { fetchRecipeById } from '../utils/api';
import { getIngredients, getEstimatedCookingTime } from '../utils/recipeHelpers';

const RecipeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadRecipe(id);
    }
  }, [id]);

  const loadRecipe = async (recipeId: string) => {
    try {
      setLoading(true);
      setError(null);
      const recipeData = await fetchRecipeById(recipeId);
      setRecipe(recipeData);
    } catch (err) {
      setError('Failed to load recipe details.');
      console.error('Error loading recipe:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ctp-base to-ctp-mantle">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ctp-peach mx-auto mb-4"></div>
            <p className="text-ctp-subtext1 text-lg">Loading recipe details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ctp-base to-ctp-mantle">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-ctp-peach hover:text-ctp-red mb-6 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Recipes
          </button>
          <div className="text-center bg-ctp-surface0 p-8 rounded-xl shadow-lg">
            <p className="text-ctp-red text-lg mb-4">{error || 'Recipe not found'}</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-ctp-peach text-ctp-base rounded-lg hover:bg-ctp-red transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const ingredients = getIngredients(recipe);
  const cookingTime = getEstimatedCookingTime(recipe.strInstructions);

  return (
    <div className="min-h-screen bg-gradient-to-br from-ctp-base to-ctp-mantle">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-ctp-peach hover:text-ctp-red mb-6 transition-colors group"
        >
          <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Recipes
        </button>

        {/* Recipe Header */}
        <div className="bg-ctp-surface0 rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="relative h-80 md:h-96">
            <img
              src={recipe.strMealThumb}
              alt={recipe.strMeal}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-ctp-base/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-ctp-peach">
                  {recipe.strCategory}
                </span>
                <span className="bg-ctp-base/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-ctp-green flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  {recipe.strArea}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-ctp-text mb-2">{recipe.strMeal}</h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recipe Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Info */}
            <div className="bg-ctp-surface0 p-6 rounded-xl shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <Clock className="h-6 w-6 text-ctp-peach mr-3" />
                  <div>
                    <p className="text-sm text-ctp-subtext1">Cooking Time</p>
                    <p className="font-semibold text-ctp-text">{cookingTime}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Users className="h-6 w-6 text-ctp-green mr-3" />
                  <div>
                    <p className="text-sm text-ctp-subtext1">Servings</p>
                    <p className="font-semibold text-ctp-text">4-6 people</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-6 w-6 text-ctp-blue mr-3" />
                  <div>
                    <p className="text-sm text-ctp-subtext1">Cuisine</p>
                    <p className="font-semibold text-ctp-text">{recipe.strArea}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-ctp-surface0 p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold text-ctp-text mb-4">Instructions</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-ctp-subtext1 leading-relaxed whitespace-pre-line">
                  {recipe.strInstructions}
                </p>
              </div>
            </div>

            {/* Additional Links */}
            <div className="bg-ctp-surface0 p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold text-ctp-text mb-4">Learn More</h2>
              <div className="flex flex-wrap gap-4">
                {recipe.strYoutube && (
                  <a
                    href={recipe.strYoutube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 bg-ctp-red text-ctp-base rounded-lg hover:bg-ctp-maroon transition-colors"
                  >
                    <Youtube className="h-5 w-5 mr-2" />
                    Watch Video
                  </a>
                )}
                {recipe.strSource && (
                  <a
                    href={recipe.strSource}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 bg-ctp-blue text-ctp-base rounded-lg hover:bg-ctp-sapphire transition-colors"
                  >
                    <ExternalLink className="h-5 w-5 mr-2" />
                    Original Recipe
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <div className="lg:col-span-1">
            <div className="bg-ctp-surface0 p-6 rounded-xl shadow-lg sticky top-4">
              <h2 className="text-2xl font-bold text-ctp-text mb-4">Ingredients</h2>
              <div className="space-y-3">
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-ctp-surface1 last:border-b-0">
                    <span className="font-medium text-ctp-text">{ingredient.name}</span>
                    <span className="text-sm text-ctp-subtext1 bg-ctp-surface1 px-2 py-1 rounded">
                      {ingredient.measure}
                    </span>
                  </div>
                ))}
              </div>

              {/* Tags */}
              {recipe.strTags && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-ctp-text mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {recipe.strTags.split(',').map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-ctp-peach/20 text-ctp-peach rounded-full text-sm font-medium"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;