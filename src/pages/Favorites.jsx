import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import PropertyCard from '../components/PropertyCard';
import { savedPropertyService, propertyService } from '../services';

const Favorites = () => {
  const [favoriteProperties, setFavoriteProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    const loadFavorites = async () => {
      setLoading(true);
      setError(null);
      try {
        const savedItems = await savedPropertyService.getAll();
        const allProperties = await propertyService.getAll();
        
        // Get full property data for saved items
        const favorites = savedItems.map(saved => {
          const property = allProperties.find(p => p.id === saved.propertyId);
          return property ? { ...property, savedDate: saved.savedDate, notes: saved.notes } : null;
        }).filter(Boolean);
        
        setFavoriteProperties(favorites);
      } catch (err) {
        setError(err.message || 'Failed to load favorite properties');
        toast.error('Failed to load favorites');
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  const handleRemoveFromFavorites = async (propertyId) => {
    try {
      await savedPropertyService.delete(propertyId);
      setFavoriteProperties(prev => prev.filter(p => p.id !== propertyId));
      toast.success('Property removed from favorites');
    } catch (err) {
      toast.error('Failed to remove from favorites');
    }
  };

  const handleClearAllFavorites = async () => {
    try {
      for (const property of favoriteProperties) {
        await savedPropertyService.delete(property.id);
      }
      setFavoriteProperties([]);
      toast.success('All favorites cleared');
    } catch (err) {
      toast.error('Failed to clear favorites');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="container mx-auto max-w-7xl">
          <div className="animate-pulse space-y-6">
            {/* Header skeleton */}
            <div className="flex justify-between items-center">
              <div className="h-8 bg-gray-200 rounded w-48"></div>
              <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>

            {/* Properties grid skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8"
        >
          <ApperIcon name="AlertCircle" size={64} className="text-error mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Favorites</h2>
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 space-y-4 sm:space-y-0"
        >
          <div>
            <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
              Favorite Properties
            </h1>
            <p className="text-gray-600">
              {favoriteProperties.length} {favoriteProperties.length === 1 ? 'property' : 'properties'} saved
            </p>
          </div>

          <div className="flex items-center space-x-4">
            {favoriteProperties.length > 0 && (
              <button
                onClick={handleClearAllFavorites}
                className="text-error hover:text-error/80 text-sm underline"
              >
                Clear All
              </button>
            )}

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
        </motion.div>

        {/* Content */}
        {favoriteProperties.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="mb-6"
            >
              <ApperIcon name="Heart" className="w-24 h-24 text-gray-300 mx-auto" />
            </motion.div>
            <h3 className="font-display text-2xl font-semibold text-gray-900 mb-4">
              No Favorite Properties Yet
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start exploring properties and save the ones you love to see them here. 
              You can add properties to your favorites by clicking the heart icon.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/browse'}
              className="bg-primary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors duration-200 inline-flex items-center space-x-2"
            >
              <ApperIcon name="Search" size={20} />
              <span>Browse Properties</span>
            </motion.button>
          </motion.div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            <AnimatePresence>
              {favoriteProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  layout
                >
                  <div className="relative">
                    <PropertyCard 
                      property={property} 
                      viewMode={viewMode}
                      isFavorite={true}
                      onToggleFavorite={() => handleRemoveFromFavorites(property.id)}
                    />
                    
                    {/* Saved Date Badge */}
                    <div className="absolute top-2 left-2 bg-accent text-white text-xs px-2 py-1 rounded-full">
                      Saved {new Date(property.savedDate).toLocaleDateString()}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Quick Actions */}
        {favoriteProperties.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 text-center"
          >
            <div className="bg-white rounded-lg shadow-card p-8">
              <h3 className="font-display text-xl font-semibold text-gray-900 mb-4">
                Ready to Take the Next Step?
              </h3>
              <p className="text-gray-600 mb-6">
                You've saved {favoriteProperties.length} amazing {favoriteProperties.length === 1 ? 'property' : 'properties'}. 
                Continue exploring or get in touch with an agent.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.href = '/browse'}
                  className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors duration-200 inline-flex items-center justify-center space-x-2"
                >
                  <ApperIcon name="Search" size={18} />
                  <span>Browse More Properties</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toast.success('Contact feature coming soon!')}
                  className="bg-secondary text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary/90 transition-colors duration-200 inline-flex items-center justify-center space-x-2"
                >
                  <ApperIcon name="MessageCircle" size={18} />
                  <span>Contact Agent</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Favorites;