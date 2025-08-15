import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChefHat, User, LogOut, ChevronDown } from "lucide-react";
import { AuthContext } from "../Context/Auth";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAuthAction = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
    console.log(LogOut);
  };

  return (
    <nav className="bg-ctp-base shadow-md border-b border-ctp-surface0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-r from-ctp-peach to-ctp-red p-2 rounded-lg">
              <ChefHat className="h-6 w-6 text-ctp-base" />
            </div>
            <span className="text-xl font-bold text-ctp-text">Food</span>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <div
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-ctp-surface0 hover:bg-ctp-surface1 cursor-pointer"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <User className="h-5 w-5 text-ctp-subtext1" />
                  <span className="text-sm font-medium text-ctp-text">{user.name}</span>
                  <ChevronDown className={`h-4 w-4 text-ctp-subtext1 ${showDropdown ? "rotate-180" : ""}`} />
                </div>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-ctp-base border rounded-lg shadow-lg">
                    <button
                      onClick={handleAuthAction}
                      className="w-full flex items-center px-4 py-3 text-white hover:bg-ctp-surface0 rounded-lg"
                    >
                      <LogOut className="h-4 w-4 mr-3 text-ctp-red" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-sm">Login</Link>
                <Link to="/register" className="px-4 py-2 bg-ctp-peach rounded-lg">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
