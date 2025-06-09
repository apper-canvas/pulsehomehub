import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ApperIcon from './ApperIcon';
import { savedPropertyService } from '../services';

const PropertyCard = ({ property, viewMode = 'grid', isFavorite: initialFavorite = false, onToggleFavorite }) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!initialFavorite) {
        try {
          const savedProperties = await savedPropertyService.getAll();
          setIsFavorite(savedProperties.some(saved => saved.propertyId === property.id));
        } catch (error) {
          console.error('Failed to check favorite status:', error);
        }
      }
    };

    checkFavoriteStatus();
  }, [property.id, initialFavorite]);

  const handleToggleFavorite = async (e) => {
    e.stopPropagation();
    
    try {
      if (isFavorite) {
        await savedPropertyService.delete(property.id);
        setIsFavorite(false);
        toast.success('Removed from favorites');
      } else {
        await savedPropertyService.create({
          propertyId: property.id,
          savedDate: new Date().toISOString(),
          notes: ''
        });
        setIsFavorite(true);
        toast.success('Added to favorites');
      }
      
      if (onToggleFavorite) {
        onToggleFavorite();
      }
    } catch (err) {
      toast.error('Failed to update favorites');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatSquareFeet = (sqft) => {
    return new Intl.NumberFormat('en-US').format(sqft);
  };

  const handleImageNavigation = (e, direction) => {
    e.stopPropagation();
    if (direction === 'next') {
      setCurrentImageIndex(prev => 
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    } else {
      setCurrentImageIndex(prev => 
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
  };

  const handleCardClick = () => {
    navigate(`/property/${property.id}`);
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        onClick={handleCardClick}
        className="bg-white rounded-lg shadow-card hover:shadow-card-hover transition-shadow duration-200 cursor-pointer overflow-hidden"
      >
        <div className="flex flex-col md:flex-row">
          {/* Image */}
          <div className="relative w-full md:w-80 h-64 flex-shrink-0 group">
            <img
              src={property.images[currentImageIndex]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            
            {/* Image Navigation */}
            {property.images.length > 1 && (
              <>
                <button
                  onClick={(e) => handleImageNavigation(e, 'prev')}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 text-gray-900 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
                >
                  <ApperIcon name="ChevronLeft" size={16} />
                </button>
                <button
                  onClick={(e) => handleImageNavigation(e, 'next')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 text-gray-900 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
                >
                  <ApperIcon name="ChevronRight" size={16} />
                </button>
              </>
            )}

            {/* Favorite Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleToggleFavorite}
              className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-colors duration-200 ${
                isFavorite 
                  ? 'bg-accent text-white' 
                  : 'bg-white/80 text-gray-600 hover:bg-white hover:text-accent'
              }`}
            >
              <motion.div
                animate={{ scale: isFavorite ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 0.3 }}
              >
                <ApperIcon name="Heart" size={18} fill={isFavorite ? 'currentColor' : 'none'} />
              </motion.div>
            </motion.button>

            {/* Price Badge */}
            <div className="absolute bottom-3 left-3 bg-secondary text-white px-3 py-1 rounded-full font-bold text-lg">
              {formatPrice(property.price)}
            </div>

            {/* Image Indicators */}
            {property.images.length > 1 && (
              <div className="absolute bottom-3 right-3 flex space-x-1">
                {property.images.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-display text-xl font-semibold text-gray-900 mb-1 line-clamp-1">
                  {property.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-1">
                  {property.address}, {property.city}, {property.state}
                </p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                property.status === 'available' 
                  ? 'bg-accent/10 text-accent' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {property.status}
              </span>
            </div>

            {/* Property Details */}
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center space-x-1 text-gray-600">
                <ApperIcon name="Bed" size={16} />
                <span className="text-sm">{property.bedrooms} beds</span>
              </div>
              <div className="flex items-center space-x-1 text-gray-600">
                <ApperIcon name="Bath" size={16} />
                <span className="text-sm">{property.bathrooms} baths</span>
              </div>
              <div className="flex items-center space-x-1 text-gray-600">
                <ApperIcon name="Square" size={16} />
                <span className="text-sm">{formatSquareFeet(property.squareFeet)} sq ft</span>
              </div>
              <div className="flex items-center space-x-1 text-gray-600">
                <ApperIcon name="Home" size={16} />
                <span className="text-sm">{property.propertyType}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-700 text-sm line-clamp-2 mb-4">
              {property.description}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                Listed {new Date(property.listingDate).toLocaleDateString()}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/property/${property.id}`);
                }}
                className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors duration-200"
              >
                View Details
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={handleCardClick}
      className="bg-white rounded-lg shadow-card hover:shadow-card-hover transition-shadow duration-200 cursor-pointer overflow-hidden group"
    >
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={property.images[currentImageIndex]}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Image Navigation */}
        {property.images.length > 1 && (
          <>
            <button
              onClick={(e) => handleImageNavigation(e, 'prev')}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 text-gray-900 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
            >
              <ApperIcon name="ChevronLeft" size={16} />
            </button>
            <button
              onClick={(e) => handleImageNavigation(e, 'next')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 text-gray-900 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
            >
              <ApperIcon name="ChevronRight" size={16} />
            </button>
          </>
        )}

        {/* Favorite Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleToggleFavorite}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-colors duration-200 ${
            isFavorite 
              ? 'bg-accent text-white' 
              : 'bg-white/80 text-gray-600 hover:bg-white hover:text-accent'
          }`}
        >
          <motion.div
            animate={{ scale: isFavorite ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            <ApperIcon name="Heart" size={18} fill={isFavorite ? 'currentColor' : 'none'} />
          </motion.div>
        </motion.button>

        {/* Price Badge */}
        <div className="absolute bottom-3 left-3 bg-secondary text-white px-3 py-1 rounded-full font-bold">
          {formatPrice(property.price)}
        </div>

        {/* Status Badge */}
        <div className={`absolute top-3 left-3 px-2 py-1 text-xs rounded-full ${
          property.status === 'available' 
            ? 'bg-accent text-white' 
            : 'bg-gray-900/70 text-white'
        }`}>
          {property.status}
        </div>

        {/* Image Indicators */}
        {property.images.length > 1 && (
          <div className="absolute bottom-3 right-3 flex space-x-1">
            {property.images.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-3">
          <h3 className="font-display text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
            {property.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-1">
            {property.address}, {property.city}, {property.state}
          </p>
        </div>

        {/* Property Details */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-4">
            <div className="flex items-center space-x-1 text-gray-600">
              <ApperIcon name="Bed" size={14} />
              <span className="text-sm">{property.bedrooms}</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-600">
              <ApperIcon name="Bath" size={14} />
              <span className="text-sm">{property.bathrooms}</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-600">
              <ApperIcon name="Square" size={14} />
              <span className="text-sm">{formatSquareFeet(property.squareFeet)}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-700 text-sm line-clamp-2 mb-4">
          {property.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {property.propertyType}
          </div>
          <div className="text-xs text-gray-500">
            Listed {new Date(property.listingDate).toLocaleDateString()}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;