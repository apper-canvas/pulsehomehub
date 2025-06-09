import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import ImageGallery from '../components/ImageGallery';
import { propertyService, savedPropertyService } from '../services';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const loadProperty = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await propertyService.getById(id);
        setProperty(data);
        
        // Check if property is favorited
        const savedProperties = await savedPropertyService.getAll();
        setIsFavorite(savedProperties.some(saved => saved.propertyId === id));
      } catch (err) {
        setError(err.message || 'Property not found');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProperty();
    }
  }, [id]);

  const handleToggleFavorite = async () => {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="h-64 bg-gray-200"></div>
          <div className="container mx-auto max-w-6xl p-6 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-48 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8"
        >
          <ApperIcon name="Home" size={64} className="text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The property you\'re looking for doesn\'t exist.'}</p>
          <button
            onClick={() => navigate('/browse')}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors duration-200"
          >
            Browse Properties
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Image Section */}
      <section className="relative h-96 overflow-hidden">
        <img
          src={property.images[activeImageIndex]}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        
        {/* Navigation */}
        <div className="absolute top-6 left-6 z-10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="bg-white/90 backdrop-blur-sm text-gray-900 p-3 rounded-full shadow-lg hover:bg-white transition-colors duration-200"
          >
            <ApperIcon name="ArrowLeft" size={20} />
          </motion.button>
        </div>

        {/* Actions */}
        <div className="absolute top-6 right-6 z-10 flex space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleToggleFavorite}
            className={`p-3 rounded-full shadow-lg backdrop-blur-sm transition-colors duration-200 ${
              isFavorite 
                ? 'bg-accent text-white' 
                : 'bg-white/90 text-gray-900 hover:bg-white'
            }`}
          >
            <motion.div
              animate={{ scale: isFavorite ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 0.3 }}
            >
              <ApperIcon name="Heart" size={20} fill={isFavorite ? 'currentColor' : 'none'} />
            </motion.div>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => toast.success('Share link copied!')}
            className="bg-white/90 backdrop-blur-sm text-gray-900 p-3 rounded-full shadow-lg hover:bg-white transition-colors duration-200"
          >
            <ApperIcon name="Share" size={20} />
          </motion.button>
        </div>

        {/* Image Gallery Button */}
        <div className="absolute bottom-6 right-6 z-10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowGallery(true)}
            className="bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-lg shadow-lg hover:bg-white transition-colors duration-200 flex items-center space-x-2"
          >
            <ApperIcon name="Image" size={18} />
            <span className="text-sm font-medium">
              {property.images.length} Photos
            </span>
          </motion.button>
        </div>

        {/* Image Navigation */}
        {property.images.length > 1 && (
          <>
            <button
              onClick={() => setActiveImageIndex(prev => 
                prev === 0 ? property.images.length - 1 : prev - 1
              )}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 text-gray-900 p-2 rounded-full hover:bg-white transition-colors duration-200"
            >
              <ApperIcon name="ChevronLeft" size={20} />
            </button>
            <button
              onClick={() => setActiveImageIndex(prev => 
                prev === property.images.length - 1 ? 0 : prev + 1
              )}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 text-gray-900 p-2 rounded-full hover:bg-white transition-colors duration-200"
            >
              <ApperIcon name="ChevronRight" size={20} />
            </button>
          </>
        )}
      </section>

      {/* Content */}
      <div className="container mx-auto max-w-6xl p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Header */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="font-display text-4xl font-bold text-gray-900 mb-2">
                      {property.title}
                    </h1>
                    <p className="text-lg text-gray-600">{property.address}</p>
                    <p className="text-gray-500">{property.city}, {property.state} {property.zipCode}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-secondary">{formatPrice(property.price)}</p>
                    <p className="text-sm text-gray-500">Listed {new Date(property.listingDate).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Key Stats */}
                <div className="flex flex-wrap gap-6 py-4 border-y border-gray-200">
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Bed" size={18} className="text-gray-500" />
                    <span className="font-semibold">{property.bedrooms}</span>
                    <span className="text-gray-600">Bedrooms</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Bath" size={18} className="text-gray-500" />
                    <span className="font-semibold">{property.bathrooms}</span>
                    <span className="text-gray-600">Bathrooms</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Square" size={18} className="text-gray-500" />
                    <span className="font-semibold">{formatSquareFeet(property.squareFeet)}</span>
                    <span className="text-gray-600">Sq Ft</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Calendar" size={18} className="text-gray-500" />
                    <span className="font-semibold">{property.yearBuilt}</span>
                    <span className="text-gray-600">Built</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="font-display text-2xl font-semibold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              {/* Features */}
              {property.features && property.features.length > 0 && (
                <div>
                  <h2 className="font-display text-2xl font-semibold text-gray-900 mb-4">Features</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {property.features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                        <span className="text-gray-700">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div>
                  <h2 className="font-display text-2xl font-semibold text-gray-900 mb-4">Amenities</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {property.amenities.map((amenity, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg"
                      >
                        <ApperIcon name="Check" size={16} className="text-accent flex-shrink-0" />
                        <span className="text-gray-700">{amenity}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Contact Card */}
              <div className="bg-white rounded-lg shadow-card p-6">
                <h3 className="font-semibold text-lg text-gray-900 mb-4">Interested in this property?</h3>
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toast.success('Contact feature coming soon!')}
                    className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <ApperIcon name="MessageCircle" size={18} />
                    <span>Contact Agent</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toast.success('Tour booking coming soon!')}
                    className="w-full bg-secondary text-white py-3 rounded-lg font-semibold hover:bg-secondary/90 transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <ApperIcon name="Calendar" size={18} />
                    <span>Schedule Tour</span>
                  </motion.button>
                </div>
              </div>

              {/* Property Details */}
              <div className="bg-white rounded-lg shadow-card p-6">
                <h3 className="font-semibold text-lg text-gray-900 mb-4">Property Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Property Type</span>
                    <span className="font-medium text-gray-900">{property.propertyType}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Lot Size</span>
                    <span className="font-medium text-gray-900">
                      {property.lotSize ? `${formatSquareFeet(property.lotSize)} sq ft` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Year Built</span>
                    <span className="font-medium text-gray-900">{property.yearBuilt}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Status</span>
                    <span className={`font-medium ${
                      property.status === 'available' ? 'text-accent' : 'text-gray-900'
                    }`}>
                      {property.status}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Price per Sq Ft</span>
                    <span className="font-medium text-gray-900">
                      {formatPrice(Math.round(property.price / property.squareFeet))}
                    </span>
                  </div>
                </div>
              </div>

              {/* Map Preview */}
              <div className="bg-white rounded-lg shadow-card p-6">
                <h3 className="font-semibold text-lg text-gray-900 mb-4">Location</h3>
                <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-8 text-center">
                  <ApperIcon name="MapPin" size={32} className="text-primary mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-4">Interactive map view</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/map')}
                    className="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-primary/90 transition-colors duration-200"
                  >
                    View on Map
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Image Gallery Modal */}
      <AnimatePresence>
        {showGallery && (
          <ImageGallery
            images={property.images}
            title={property.title}
            isOpen={showGallery}
            onClose={() => setShowGallery(false)}
            initialIndex={activeImageIndex}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PropertyDetail;