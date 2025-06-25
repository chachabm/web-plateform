import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Grid, List, SortAsc, SortDesc, CreditCard, Star } from 'lucide-react';
import PremiumCourseCard from '../components/Payment/PremiumCourseCard';
import { mockCourses, categories, levels } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';

// Ajouter des prix aux cours mockés
const premiumCourses = mockCourses.map(course => ({
  ...course,
  price: Math.floor(Math.random() * 50) + 30, // Prix entre 30€ et 80€
  originalPrice: Math.floor(Math.random() * 100) + 80, // Prix original entre 80€ et 180€
  discount: Math.floor(Math.random() * 30) + 20 // Réduction entre 20% et 50%
}));

const PremiumCourses: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);

  const filteredCourses = premiumCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All Categories' || 
                           course.language === selectedCategory;
    
    const matchesLevel = selectedLevel === 'All Levels' || 
                        course.level === selectedLevel;
    
    const matchesPrice = course.price >= priceRange[0] && course.price <= priceRange[1];

    return matchesSearch && matchesCategory && matchesLevel && matchesPrice;
  });

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return new Date(b.id).getTime() - new Date(a.id).getTime();
      case 'discount':
        return (b.discount || 0) - (a.discount || 0);
      case 'alphabetical':
        return a.title.localeCompare(b.title);
      default:
        return b.students - a.students; // Popular
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled by the filter effect
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All Categories');
    setSelectedLevel('All Levels');
    setSortBy('popular');
    setPriceRange([0, 200]);
  };

  const handlePurchase = (courseId: string) => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/checkout/${courseId}` } } });
      return;
    }
    
    navigate(`/checkout/${courseId}`);
  };

  const handlePriceRangeChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = parseInt(e.target.value);
    setPriceRange(prev => {
      const newRange = [...prev] as [number, number];
      newRange[index] = value;
      return newRange;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Cours Premium</h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Investissez dans votre avenir avec nos cours premium de haute qualité. Accès à vie et garantie de satisfaction.
            </p>
            <div className="mt-8 max-w-3xl mx-auto">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Rechercher des cours premium..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-none rounded-full focus:ring-2 focus:ring-white/50 focus:border-transparent bg-white/10 backdrop-blur-sm text-white placeholder-white/70"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-primary-600 px-4 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors"
                >
                  Rechercher
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              {/* Category Filter */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white pr-8"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Level Filter */}
              <div className="relative">
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white pr-8"
                >
                  {levels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white pr-8"
                >
                  <option value="popular">Les plus populaires</option>
                  <option value="rating">Les mieux notés</option>
                  <option value="price-low">Prix: croissant</option>
                  <option value="price-high">Prix: décroissant</option>
                  <option value="discount">Meilleures réductions</option>
                  <option value="newest">Plus récents</option>
                  <option value="alphabetical">Alphabétique</option>
                </select>
              </div>

              {/* Clear Filters */}
              {(searchTerm || selectedCategory !== 'All Categories' || selectedLevel !== 'All Levels' || sortBy !== 'popular' || priceRange[0] > 0 || priceRange[1] < 200) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-primary-600 hover:text-primary-700 font-medium"
                >
                  Réinitialiser les filtres
                </button>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {sortedCourses.length} cours trouvés
              </span>
              
              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'}`}
                  title="Vue en grille"
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'}`}
                  title="Vue en liste"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              {/* Advanced Filters Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter className="h-4 w-4" />
                <span>Filtres</span>
              </button>
            </div>
          </div>

          {/* Advanced Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fourchette de prix (€)
                  </label>
                  <div className="flex space-x-4 items-center">
                    <input
                      type="number"
                      min="0"
                      max={priceRange[1]}
                      value={priceRange[0]}
                      onChange={(e) => handlePriceRangeChange(e, 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <span>à</span>
                    <input
                      type="number"
                      min={priceRange[0]}
                      max="200"
                      value={priceRange[1]}
                      onChange={(e) => handlePriceRangeChange(e, 1)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div className="mt-2">
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={priceRange[0]}
                      onChange={(e) => handlePriceRangeChange(e, 0)}
                      className="w-full"
                    />
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={priceRange[1]}
                      onChange={(e) => handlePriceRangeChange(e, 1)}
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Durée
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                    <option value="">Toutes les durées</option>
                    <option value="short">Moins de 10 heures</option>
                    <option value="medium">10-25 heures</option>
                    <option value="long">Plus de 25 heures</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Note
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                    <option value="">Toutes les notes</option>
                    <option value="4.5">4.5+ étoiles</option>
                    <option value="4.0">4.0+ étoiles</option>
                    <option value="3.5">3.5+ étoiles</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => setShowFilters(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    // Appliquer les filtres avancés
                    setShowFilters(false);
                  }}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Appliquer les filtres
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Course Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Bannière promotionnelle */}
        <div className="bg-gradient-to-r from-secondary-600 to-yellow-500 text-white rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold mb-2">Offre Spéciale 🎉</h2>
              <p className="text-white/90">Utilisez le code <span className="font-bold bg-white/20 px-2 py-1 rounded">LEARNME50</span> pour obtenir 50% de réduction sur tous les cours premium !</p>
            </div>
            <button className="bg-white text-secondary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Appliquer le code</span>
            </button>
          </div>
        </div>

        {sortedCourses.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun cours trouvé</h3>
            <p className="text-gray-600 mb-4">
              Essayez d'ajuster vos critères de recherche ou parcourez tous les cours
            </p>
            <button
              onClick={clearFilters}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Réinitialiser tous les filtres
            </button>
          </div>
        ) : (
          <div className={`grid gap-8 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {sortedCourses.map((course) => (
              <PremiumCourseCard 
                key={course.id} 
                course={course} 
                onPurchase={handlePurchase} 
              />
            ))}
          </div>
        )}

        {/* Load More Button */}
        {sortedCourses.length > 0 && (
          <div className="text-center mt-12">
            <button
              onClick={() => alert('Chargement de plus de cours...')}
              className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Charger plus de cours
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PremiumCourses;