import React from 'react';
import { Clock, MapPin, Tag } from 'lucide-react';
import { Recipe } from '../types/recipe';
import { getIngredients, getEstimatedCookingTime } from '../utils/recipeHelpers';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick }) => {
  const ingredients = getIngredients(recipe);
  const cookingTime = getEstimatedCookingTime(recipe.strInstructions);
  const mainIngredients = ingredients.slice(0, 4);

  return (
    <div
      onClick={onClick}
      className="bg-ctp-surface0 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group border border-ctp-surface1 hover:border-ctp-peach/50"
    >
      {/* Recipe Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-ctp-base/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-ctp-peach">
            {recipe.strCategory}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="bg-ctp-crust/70 backdrop-blur-sm px-2 py-1 rounded-full text-xs text-ctp-text flex items-center">
            <MapPin className="h-3 w-3 mr-1" />
            {recipe.strArea}
          </span>
        </div>
      </div>

      {/* Recipe Content */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-ctp-text mb-3 group-hover:text-ctp-peach transition-colors line-clamp-2">
          {recipe.strMeal}
        </h3>

        {/* Cooking Time */}
        <div className="flex items-center text-ctp-subtext1 mb-4">
          <Clock className="h-4 w-4 mr-2 text-ctp-peach" />
          <span className="text-sm font-medium">{cookingTime}</span>
        </div>

        {/* Ingredients Preview */}
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <Tag className="h-4 w-4 mr-2 text-ctp-green" />
            <span className="text-sm font-medium text-ctp-subtext1">Main Ingredients:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {mainIngredients.map((ingredient, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-ctp-green/20 text-ctp-green rounded-full text-xs font-medium border border-ctp-green/30"
              >
                {ingredient.name}
              </span>
            ))}
            {ingredients.length > 4 && (
              <span className="px-3 py-1 bg-ctp-surface1 text-ctp-subtext1 rounded-full text-xs font-medium">
                +{ingredients.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Tags */}
        {recipe.strTags && (
          <div className="flex flex-wrap gap-2">
            {recipe.strTags.split(',').slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-ctp-peach/20 text-ctp-peach rounded text-xs font-medium"
              >
                {tag.trim()}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeCard;