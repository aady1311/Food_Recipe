import React, { useState, useContext } from 'react';
import { Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/Auth';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 🔒 Login check
    if (!user) {
      navigate('/login'); // User not logged in → go to login
      return;
    }

    // ✅ User logged in → perform search
    onSearch(query);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for delicious recipes..."
              className="w-full h-14 pl-6 pr-20 text-lg bg-ctp-surface0 border-2 border-ctp-surface1 rounded-full focus:border-ctp-peach focus:outline-none focus:ring-4 focus:ring-ctp-peach/20 transition-all duration-200 shadow-lg hover:shadow-xl text-ctp-text placeholder-ctp-subtext0"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 h-10 w-10 bg-ctp-peach text-ctp-base rounded-full hover:bg-ctp-red transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg group"
            >
              <Search className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </button>
          </div>
          {/* 
          <button
            type="button"
            className="ml-4 h-14 w-14 bg-ctp-surface0 text-ctp-subtext1 rounded-full hover:bg-ctp-surface1 hover:text-ctp-text transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg"
            title="Advanced Filters"
          >
            <Filter className="h-5 w-5" />
          </button> 
          */}
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
