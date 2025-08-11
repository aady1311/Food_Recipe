import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ChefHat } from 'lucide-react';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
    
  //   if (formData.password !== formData.confirmPassword) {
  //     alert('Passwords do not match!');
  //     return;
  //   }

  //   setIsLoading(true);
    
  //   // Simulate API call
  //   setTimeout(() => {
  //     setIsLoading(false);
  //     console.log('Register attempt:', formData);
  //     // For now, just navigate to home
  //     navigate('/');
  //   }, 1000);
  // };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    alert('Passwords do not match!');
    return;
  }

  setIsLoading(true);

  try {
    const res = await fetch(`http://localhost:8080/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData) // sending your signup data
    });

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data = await res.json();
    console.log('Response from backend:', data);

    navigate('/');
  } catch (error) {
    console.error('Error during POST request:', error);
    alert('Something went wrong! Please try again.');
  } finally {
    setIsLoading(false);
  }
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
          <h2 className="mt-6 text-3xl font-bold text-ctp-text">Create your account</h2>
          <p className="mt-2 text-sm text-ctp-subtext1">
            Join Forgotten and discover amazing recipes
          </p>
        </div>

        <div className="bg-ctp-surface0 p-8 rounded-xl shadow-lg">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-ctp-subtext1 mb-2">
                Full name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-ctp-subtext0" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-ctp-surface1 rounded-lg focus:outline-none focus:ring-2 focus:ring-ctp-peach focus:border-transparent transition-colors bg-ctp-base text-ctp-text placeholder-ctp-subtext0"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

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
                  value={formData.email}
                  onChange={handleChange}
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
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-3 border border-ctp-surface1 rounded-lg focus:outline-none focus:ring-2 focus:ring-ctp-peach focus:border-transparent transition-colors bg-ctp-base text-ctp-text placeholder-ctp-subtext0"
                  placeholder="Create a password"
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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-ctp-subtext1 mb-2">
                Confirm password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-ctp-subtext0" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-3 border border-ctp-surface1 rounded-lg focus:outline-none focus:ring-2 focus:ring-ctp-peach focus:border-transparent transition-colors bg-ctp-base text-ctp-text placeholder-ctp-subtext0"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-ctp-subtext0 hover:text-ctp-subtext1 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-ctp-subtext0 hover:text-ctp-subtext1 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="accept-terms"
                name="accept-terms"
                type="checkbox"
                required
                className="h-4 w-4 text-ctp-peach focus:ring-ctp-peach border-ctp-surface1 rounded bg-ctp-base"
              />
              <label htmlFor="accept-terms" className="ml-2 block text-sm text-ctp-text">
                I agree to the{' '}
                <a href="#" className="text-ctp-peach hover:text-ctp-red transition-colors">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-ctp-peach hover:text-ctp-red transition-colors">
                  Privacy Policy
                </a>
              </label>
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
                    Creating account...
                  </div>
                ) : (
                  'Create account'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-ctp-subtext1">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-ctp-peach hover:text-ctp-red transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;