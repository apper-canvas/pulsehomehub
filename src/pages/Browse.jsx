import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import PropertyCard from '../components/PropertyCard';
import FilterSidebar from '../components/FilterSidebar';
import { propertyService } from '../services';

const Browse = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    priceMin: '',
    priceMax: '',
    propertyTypes: [],
    bedroomsMin: '',
    bathroomsMin: '',
    squareFeetMin: ''
  });

  // Parse URL search params
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const search = urlParams.get('search');
    if (search) {
      setSearchQuery(search);
    }
  }, [location.search]);

  // Load properties
  useEffect(() => {
    const loadProperties = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await propertyService.getAll();
        setProperties(data);
        setFilteredProperties(data);
      } catch (err) {
        setError(err.message || 'Failed to load properties');
        toast.error('Failed to load properties');
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...properties];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(property => 
        property.title.toLowerCase().includes(query) ||
        property.address.toLowerCase().includes(query) ||
        property.city.toLowerCase().includes(query) ||
        property.zipCode.includes(query)
      );
    }

    // Price filter
    if (activeFilters.priceMin) {
      filtered = filtered.filter(property => property.price >= parseInt(activeFilters.priceMin));
    }
    if (activeFilters.priceMax) {
      filtered = filtered.filter(property => property.price <= parseInt(activeFilters.priceMax));
    }

    // Property type filter
    if (activeFilters.propertyTypes.length > 0) {
      filtered = filtered.filter(property => activeFilters.propertyTypes.includes(property.propertyType));
    }

    // Bedrooms filter
    if (activeFilters.bedroomsMin) {
      filtered = filtered.filter(property => property.bedrooms >= parseInt(activeFilters.bedroomsMin));
    }

    // Bathrooms filter
    if (activeFilters.bathroomsMin) {
      filtered = filtered.filter(property => property.bathrooms >= parseInt(activeFilters.bathroomsMin));
    }

    // Square feet filter
    if (activeFilters.squareFeetMin) {
      filtered = filtered.filter(property => property.squareFeet >= parseInt(activeFilters.squareFeetMin));
    }

    // Sort results
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'beds':
        filtered.sort((a, b) => b.bedrooms - a.bedrooms);
        break;
      case 'size':
        filtered.sort((a, b) => b.squareFeet - a.squareFeet);
        break;
      default: // newest
        filtered.sort((a, b) => new Date(b.listingDate) - new Date(a.listingDate));
    }

    setFilteredProperties(filtered);
  }, [properties, searchQuery, activeFilters, sortBy]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Update URL with search params
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim());
    }
    navigate(`/browse?${params.toString()}`);
  };

  const clearFilters = () => {
    setActiveFilters({
      priceMin: '',
      priceMax: '',
      propertyTypes: [],
      bedroomsMin: '',
      bathroomsMin: '',
      squareFeetMin: ''
    });
    setSearchQuery('');
    navigate('/browse');
  };

  const hasActiveFilters = () => {
    return searchQuery.trim() || 
           activeFilters.priceMin || 
           activeFilters.priceMax || 
           activeFilters.propertyTypes.length > 0 || 
           activeFilters.bedroomsMin || 
           activeFilters.bathroomsMin || 
           activeFilters.squareFeetMin;
  };

  if (loading) {
    return (
      <div className="h-screen flex overflow-hidden bg-background">
        {/* Desktop Filter Sidebar Skeleton */}
        <div className="hidden lg:block w-80 bg-white border-r border-gray-200 p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="animate-pulse space-y-6">
            {/* Header skeleton */}
            <div className="flex justify-between items-center">
              <div className="h-8 bg-gray-200 rounded w-48"></div>
              <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>

            {/* Properties grid skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-lg shadow-card overflow-hidden"
                >
                  <div className="h-64 bg-gray-200"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8"
        >
          <ApperIcon name="AlertCircle" size={64} className="text-error mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Properties</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors duration-200"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Desktop Filter Sidebar */}
      <div className="hidden lg:block w-80 bg-white border-r border-gray-200">
        <FilterSidebar
          filters={activeFilters}
          onFiltersChange={setActiveFilters}
          onClearFilters={clearFilters}
        />
      </div>

      {/* Mobile Filter Overlay */}
      {showMobileFilters && (
        <div className="lg:hidden fixed inset-0 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowMobileFilters(false)}
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            className="absolute left-0 top-0 h-full w-80 bg-white shadow-xl"
          >
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="font-semibold text-lg">Filters</h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors duration-200"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>
            <FilterSidebar
              filters={activeFilters}
              onFiltersChange={setActiveFilters}
              onClearFilters={clearFilters}
            />
          </motion.div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Search Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by city, address, or zip code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bottom-2 px-4 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center"
              >
                <ApperIcon name="Search" size={18} />
              </button>
            </div>
          </form>
        </div>

        {/* Controls Bar */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-2"
              >
                <ApperIcon name="Filter" size={18} />
                <span>Filters</span>
                {hasActiveFilters() && (
                  <span className="bg-secondary text-white text-xs px-2 py-1 rounded-full">!</span>
                )}
              </button>

              <div className="flex items-center space-x-2">
                <span className="text-gray-600">
                  {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'}
                </span>
                {hasActiveFilters() && (
                  <button
                    onClick={clearFilters}
                    className="text-secondary hover:text-secondary/80 text-sm underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="beds">Most Bedrooms</option>
                <option value="size">Largest First</option>
              </select>

              {/* View Mode Toggle */}
              <div className="hidden sm:flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors duration-200 ${
                    viewMode === 'grid' ? 'bg-white shadow-sm text-primary' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <ApperIcon name="Grid3X3" size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors duration-200 ${
                    viewMode === 'list' ? 'bg-white shadow-sm text-primary' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <ApperIcon name="List" size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="p-6">
          {filteredProperties.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                <ApperIcon name="Home" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
              <p className="text-gray-600 mb-6">
                {hasActiveFilters() 
                  ? "Try adjusting your filters to see more results"
                  : "No properties match your search criteria"
                }
              </p>
              {hasActiveFilters() && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearFilters}
                  className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors duration-200"
                >
                  Clear All Filters
                </motion.button>
              )}
            </motion.div>
          ) : (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {filteredProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <PropertyCard 
                    property={property} 
                    viewMode={viewMode}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Browse;