import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import RecipeCard from '../components/RecipeCard';
import { Recipe } from '../types/recipe';
import { fetchRecipes } from '../utils/api';
import { Loader2 } from 'lucide-react';

const ITEMS_PER_PAGE = 4;

const Home: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchRecipes(1, 293);
      setRecipes(response.data.data);
      setFilteredRecipes(response.data.data);
    } catch (err) {
      setError('Failed to load recipes. Please try again later.');
      console.error('Error loading recipes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredRecipes(recipes);
      setPage(1);
      return;
    }
    const lowerQuery = query.toLowerCase();
    const filtered = recipes.filter(recipe =>
      recipe.strMeal?.toLowerCase().includes(lowerQuery) ||
      recipe.strCategory?.toLowerCase().includes(lowerQuery) ||
      recipe.strArea?.toLowerCase().includes(lowerQuery)
    );
    setFilteredRecipes(filtered);
    setPage(1);
  };

  const handleRecipeClick = (recipe: Recipe) => {
    navigate(`/recipe/${recipe.id}`);
  };

  const totalResults = filteredRecipes.length;
  const totalPages = Math.ceil(totalResults / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE + 1;
  const endIndex = Math.min(page * ITEMS_PER_PAGE, totalResults);

  const paginatedRecipes = filteredRecipes.slice(startIndex - 1, endIndex);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-orange-600 text-lg">Loading delicious recipes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button
            onClick={loadRecipes}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-red-to-br from-orange-50 to-yellow-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-400 via-red-400 to-yellow-400 text-white shadow-md">
        <div className="max-w-7xl mx-auto py-12 px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-md">
            Discover Amazing{' '}
            <span className="bg-white text-orange-500 px-2 rounded-lg">
              Recipes
            </span>
          </h1>
          <p className="text-lg max-w-2xl mx-auto drop-shadow-sm">
            Explore thousands of delicious recipes from around the world. Find your next favorite dish!
          </p>
          <div className="mt-6">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </div>

      {/* Recipes Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-orange-700">Featured Recipes</h2>
          <p className="text-orange-500">Hand-picked recipes that are trending right now</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedRecipes.map((recipe) => (
            <div className="transform transition duration-300 hover:scale-105">
              <RecipeCard
                key={recipe.idMeal}
                recipe={recipe}
                onClick={() => handleRecipeClick(recipe)}
              />
            </div>
          ))}
        </div>

        {filteredRecipes.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-orange-500 text-lg">No recipes found. Please try again later.</p>
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-10 px-4">
            <button
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              disabled={page === 1}
              className={`px-4 py-2 rounded-full shadow-md ${
                page === 1
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-orange-500 text-white hover:bg-orange-600'
              }`}
            >
              ← Previous
            </button>

            <span className="font-semibold text-orange-600">
              {startIndex}-{endIndex} of {totalResults} results
            </span>

            <button
              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className={`px-4 py-2 rounded-full shadow-md ${
                page === totalPages
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-orange-500 text-white hover:bg-orange-600'
              }`}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
