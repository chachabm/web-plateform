import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, BookOpen, Users, TrendingUp, Video } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const TeacherLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the page user was trying to access before being redirected to login
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      // Redirect to the page they were trying to access, or dashboard
      navigate(from, { replace: true });
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-purple-50 to-pink-100 flex">
      {/* Left Side - Teacher Benefits */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-secondary-600 via-purple-600 to-pink-700 text-white items-center justify-center p-12">
        <div className="max-w-md space-y-8">
          <div className="text-center">
            <Users className="h-16 w-16 mx-auto mb-6 text-purple-200" />
            <h3 className="text-3xl font-bold mb-4">Teach & Inspire</h3>
            <p className="text-purple-100 text-lg">
              Share your knowledge with thousands of eager learners worldwide
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <Video className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-semibold text-lg">Create Courses</h4>
                <p className="text-purple-100">Build engaging video courses with our tools</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-semibold text-lg">Reach Students</h4>
                <p className="text-purple-100">Connect with learners from around the world</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-semibold text-lg">Track Performance</h4>
                <p className="text-purple-100">Monitor your course analytics and growth</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="text-2xl font-bold mb-2">1,500+</div>
            <div className="text-purple-100">Active Instructors</div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
              <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-3 rounded-lg">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">LearnMe</span>
            </Link>
            <h2 className="text-3xl font-bold text-gray-900">
              Welcome Back, Teacher!
            </h2>
            <p className="mt-2 text-gray-600">
              Access your instructor dashboard
            </p>
            {from !== '/dashboard' && (
              <div className="mt-4 bg-purple-50 border border-purple-200 rounded-lg p-3">
                <p className="text-purple-800 text-sm">
                  You'll be redirected to your requested page after signing in.
                </p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-secondary-600 focus:ring-secondary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm text-secondary-600 hover:text-secondary-700 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-secondary-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-secondary-700 hover:to-purple-700 focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Signing In...</span>
                  </div>
                ) : (
                  'Sign In as Teacher'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-secondary-600 hover:text-secondary-700 transition-colors">
                  Sign up as Teacher
                </Link>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Are you a student?{' '}
                <Link 
                  to="/student-login" 
                  state={{ from: location.state?.from }}
                  className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherLogin;