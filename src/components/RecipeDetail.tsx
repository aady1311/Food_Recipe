import React from 'react';
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  MapPin, 
  Heart, 
  ChefHat,
  List,
  Timer
} from 'lucide-react';
import { Recipe } from '../types/Recipe';

interface RecipeDetailProps {
  recipe: Recipe;
  onBack: () => void;
  onToggleFavorite: (recipe: Recipe) => void;
  isFavorite: boolean;
}

export const RecipeDetail: React.FC<RecipeDetailProps> = ({
  recipe,
  onBack,
  onToggleFavorite,
  isFavorite
}) => {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="relative">
        <img
          src={recipe.image_url}
          alt={recipe.title}
          className="w-full h-64 sm:h-80 object-cover"
        />
        
        {/* Overlay controls */}
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg hover:bg-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>
          
          <button
            onClick={() => onToggleFavorite(recipe)}
            className={`p-3 rounded-full transition-colors ${
              isFavorite 
                ? 'bg-red-500 text-white' 
                : 'bg-white/90 backdrop-blur-sm text-gray-400 hover:text-red-500'
            }`}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Recipe info overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
          <div className="flex items-center space-x-2 mb-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-500 text-white">
              <MapPin className="h-4 w-4 mr-1" />
              {recipe.region}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm text-white">
              {recipe.type}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            {recipe.title}
          </h1>
          <p className="text-white/90 text-sm sm:text-base">
            {recipe.description}
          </p>
        </div>
      </div>

      <div className="p-6">
        {/* Recipe meta info */}
        <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <Timer className="h-6 w-6 mx-auto mb-2 text-orange-500" />
            <div className="text-sm text-gray-600">Prep Time</div>
            <div className="font-semibold">{recipe.prep_time} min</div>
          </div>
          <div className="text-center">
            <Clock className="h-6 w-6 mx-auto mb-2 text-orange-500" />
            <div className="text-sm text-gray-600">Cook Time</div>
            <div className="font-semibold">{recipe.cook_time} min</div>
          </div>
          <div className="text-center">
            <Users className="h-6 w-6 mx-auto mb-2 text-orange-500" />
            <div className="text-sm text-gray-600">Servings</div>
            <div className="font-semibold">{recipe.servings}</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Ingredients */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <List className="h-6 w-6 text-orange-500" />
              <h2 className="text-xl font-semibold text-gray-900">Ingredients</h2>
            </div>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="inline-block w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-gray-700">{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <ChefHat className="h-6 w-6 text-orange-500" />
              <h2 className="text-xl font-semibold text-gray-900">Instructions</h2>
            </div>
            <ol className="space-y-4">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="flex space-x-3">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-orange-500 text-white text-sm font-medium rounded-full flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{instruction}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Tags */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {recipe.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 text-sm bg-orange-100 text-orange-800 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};