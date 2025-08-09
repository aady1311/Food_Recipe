import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ChefHat } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      console.log('Login attempt:', { email, password });
      // For now, just navigate to home
      navigate('/');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ctp-base to-ctp-mantle flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-ctp-peach to-ctp-red p-3 rounded-xl">
              <ChefHat className="h-8 w-8 text-ctp-base" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-ctp-text">Welcome back!</h2>
          <p className="mt-2 text-sm text-ctp-subtext1">
            Sign in to your FlavorHub account
          </p>
        </div>

        <div className="bg-ctp-surface0 p-8 rounded-xl shadow-lg">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-ctp-subtext1 mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-ctp-subtext0" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-ctp-surface1 rounded-lg focus:outline-none focus:ring-2 focus:ring-ctp-peach focus:border-transparent transition-colors bg-ctp-base text-ctp-text placeholder-ctp-subtext0"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-ctp-subtext1 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-ctp-subtext0" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-ctp-surface1 rounded-lg focus:outline-none focus:ring-2 focus:ring-ctp-peach focus:border-transparent transition-colors bg-ctp-base text-ctp-text placeholder-ctp-subtext0"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-ctp-subtext0 hover:text-ctp-subtext1 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-ctp-subtext0 hover:text-ctp-subtext1 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-ctp-peach focus:ring-ctp-peach border-ctp-surface1 rounded bg-ctp-base"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-ctp-text">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-ctp-peach hover:text-ctp-red transition-colors">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-ctp-base bg-gradient-to-r from-ctp-peach to-ctp-red hover:from-ctp-red hover:to-ctp-maroon focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ctp-peach disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-ctp-base mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-ctp-subtext1">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-ctp-peach hover:text-ctp-red transition-colors">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;