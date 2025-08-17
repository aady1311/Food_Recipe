import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { RecipeCard } from './components/RecipeCard';
import { RecipeDetail } from './components/RecipeDetail';
import { FilterPanel } from './components/FilterPanel';
import { AdminPanel } from './components/AdminPanel';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Recipe, RecipeFilters } from './types/Recipe';
import { recipeService } from './services/RecipeService';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<RecipeFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Load initial data
  useEffect(() => {
    loadRecipes();
  }, []);

  // Filter recipes when filters or search query changes
  useEffect(() => {
    filterRecipes();
  }, [recipes, filters, searchQuery]);

  const loadRecipes = async () => {
    setLoading(true);
    try {
      const data = await recipeService.getAllRecipes();
      setRecipes(data);
    } catch (error) {
      console.error('Error loading recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterRecipes = async () => {
    try {
      const filtered = await recipeService.searchRecipes(filters, searchQuery);
      setFilteredRecipes(filtered);
    } catch (error) {
      console.error('Error filtering recipes:', error);
      setFilteredRecipes(recipes);
    }
  };

  const handleRecipeSelect = async (recipe: Recipe) => {
    // Get full recipe details (this will add to recent views)
    const fullRecipe = await recipeService.getRecipeById(recipe.id);
    if (fullRecipe) {
      setSelectedRecipe(fullRecipe);
      setCurrentView('detail');
    }
  };

  const handleToggleFavorite = (recipe: Recipe) => {
    recipeService.toggleFavorite(recipe);
    // Force re-render if we're viewing favorites
    if (currentView === 'favorites') {
      loadRecipes();
    }
  };

  const handleCreateRecipe = async (recipeData: Omit<Recipe, 'id' | 'created_at'>) => {
    // Note: In API mode, we don't create recipes locally
    console.log('Recipe creation not available in API mode');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters({});
    setShowFilters(false);
  };

  const handleViewChange = (view: string) => {
    setCurrentView(view);
    setSelectedRecipe(null);
    setSearchQuery('');
    setFilters({});
    setShowFilters(false);
  };

  const getDisplayRecipes = () => {
    switch (currentView) {
      case 'favorites':
        return recipeService.getFavorites();
      case 'recent':
        return recipeService.getRecentViews();
      case 'search':
        return filteredRecipes;
      default:
        return filteredRecipes;
    }
  };

  const getViewTitle = () => {
    switch (currentView) {
      case 'favorites':
        return 'Your Favorite Recipes';
      case 'recent':
        return 'Recently Viewed Recipes';
      case 'search':
        return searchQuery ? `Search Results for "${searchQuery}"` : 'All Recipes';
      case 'admin':
        return 'Admin Panel';
      default:
        return 'Discover Traditional Recipes';
    }
  };

  if (currentView === 'detail' && selectedRecipe) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header 
          currentView={currentView} 
          onViewChange={handleViewChange}
          onSearch={handleSearch}
        />
        <div className="py-8 px-4">
          <RecipeDetail
            recipe={selectedRecipe}
            onBack={() => setCurrentView('home')}
            onToggleFavorite={handleToggleFavorite}
            isFavorite={recipeService.isFavorite(selectedRecipe)}
          />
        </div>
      </div>
    );
  }

  if (currentView === 'admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header 
          currentView={currentView} 
          onViewChange={handleViewChange}
          onSearch={handleSearch}
        />
        <div className="py-8">
          <AdminPanel
            recipes={recipes}
            onRefreshRecipes={loadRecipes}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        currentView={currentView} 
        onViewChange={handleViewChange}
        onSearch={handleSearch}
      />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {getViewTitle()}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover authentic recipes from around the world using real-time API data. 
            Search by cuisine, ingredients, or recipe names to find your perfect dish.
          </p>
        </div>

        {/* Filters */}
        {(currentView === 'home' || currentView === 'search') && (
          <div className="relative mb-8">
            <FilterPanel
              filters={filters}
              onFiltersChange={setFilters}
              regions={recipeService.getRegions()}
              types={recipeService.getTypes()}
              tags={recipeService.getTags()}
              isOpen={showFilters}
              onToggle={() => setShowFilters(!showFilters)}
            />
          </div>
        )}

        {/* Recipe Grid */}
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {getDisplayRecipes().map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onSelect={handleRecipeSelect}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={recipeService.isFavorite(recipe)}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && getDisplayRecipes().length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m-7-12l4-4m0 0l4 4m-4-4v16" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No recipes found
            </h3>
            <p className="text-gray-600">
              {currentView === 'favorites' 
                ? "You haven't added any favorites yet. Start exploring recipes to add them to your favorites!"
                : currentView === 'recent'
                ? "You haven't viewed any recipes yet. Start exploring to see your recent views here!"
                : "Try adjusting your search criteria or filters to find more recipes."
              }
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Preserving culinary traditions for future generations
            </p>
            <div className="text-sm text-gray-500">
              <p>Built with React, TypeScript, Real-time APIs, and advanced Data Structures</p>
              <p>Features: API Integration • Queue-based Recent Views • Set-based Favorites • HashMap Search • LRU Caching</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;