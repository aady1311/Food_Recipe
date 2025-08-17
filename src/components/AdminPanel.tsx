import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { Recipe } from '../types/Recipe';

interface AdminPanelProps {
  recipes: Recipe[];
  onRefreshRecipes: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  recipes,
  onRefreshRecipes
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">API Recipe Explorer</h2>
        <button
          onClick={onRefreshRecipes}
          disabled={loading}
          className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          <span>{loading ? 'Loading...' : 'Refresh Recipes'}</span>
        </button>
      </div>

      {/* API Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">API Integration Status</h3>
        <p className="text-blue-800 text-sm">
          This application fetches real recipe data from TheMealDB API. 
          Recipes are cached for performance and filtered using advanced data structures.
        </p>
        <div className="mt-2 text-sm text-blue-700">
          <strong>Features:</strong> Real-time search, cuisine filtering, ingredient-based search, caching with TTL
        </div>
      </div>

      {/* Recipe List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Recipe
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Region
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Source
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {recipes.map((recipe) => (
              <tr key={recipe.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      className="h-10 w-10 rounded-lg object-cover"
                      src={recipe.image_url}
                      alt={recipe.title}
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {recipe.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {recipe.prep_time + recipe.cook_time} min • {recipe.servings} servings
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {recipe.region}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {recipe.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    API
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {recipes.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No recipes loaded. Click "Refresh Recipes" to fetch from API.</p>
        </div>
      )}
    </div>
  );
};