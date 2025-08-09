import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChefHat, User, LogOut, ChevronDown } from 'lucide-react';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = true; // This will be connected to real auth later
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAuthAction = () => {
    if (isAuthenticated) {
      // Handle logout
      console.log('Logging out...');
      setShowDropdown(false);
    } else {
      navigate('/login');
    }
  };

  return (
    <nav className="bg-ctp-base shadow-md border-b border-ctp-surface0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-r from-ctp-peach to-ctp-red p-2 rounded-lg group-hover:scale-105 transition-transform duration-200">
              <ChefHat className="h-6 w-6 text-ctp-base" />
            </div>
            <span className="text-xl font-bold text-ctp-text group-hover:text-ctp-peach transition-colors">
              Food
            </span>
          </Link>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <div 
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-ctp-surface0 hover:bg-ctp-surface1 transition-colors cursor-pointer"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <User className="h-5 w-5 text-ctp-subtext1" />
                  <span className="text-sm font-medium text-ctp-text">John Doe</span>
                  <ChevronDown className={`h-4 w-4 text-ctp-subtext1 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                </div>
                
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-ctp-base border border-ctp-surface0 rounded-lg shadow-lg z-50">
                    <button
                      onClick={handleAuthAction}
                      className="w-full flex items-center px-4 py-3 text-sm text-ctp-text hover:bg-ctp-surface0 transition-colors rounded-lg"
                    >
                      <LogOut className="h-4 w-4 mr-3 text-ctp-red" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-ctp-subtext1 hover:text-ctp-peach transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-ctp-peach text-ctp-base text-sm font-medium rounded-lg hover:bg-ctp-red transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;