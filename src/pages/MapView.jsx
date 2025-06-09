import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import PropertyCard from '../components/PropertyCard';
import { propertyService } from '../services';

const MapView = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 37.7749, lng: -122.4194 }); // San Francisco default

  useEffect(() => {
    const loadProperties = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await propertyService.getAll();
        setProperties(data);
        
        // Set map center to first property if available
        if (data.length > 0) {
          setMapCenter({
            lat: data[0].latitude,
            lng: data[0].longitude
          });
        }
      } catch (err) {
        setError(err.message || 'Failed to load properties');
        toast.error('Failed to load properties');
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map and properties...</p>
        </motion.div>
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
          <ApperIcon name="MapPin" size={64} className="text-error mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Map Unavailable</h2>
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
      {/* Map Container */}
      <div className="flex-1 relative bg-gradient-to-br from-blue-50 to-green-50">
        {/* Interactive Map Placeholder */}
        <div className="h-full w-full relative overflow-hidden">
          {/* Map Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-green-50 to-blue-50">
            {/* Grid pattern to simulate map */}
            <div className="absolute inset-0 opacity-20">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#60a5fa" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
          </div>

          {/* Property Markers */}
          {properties.map((property, index) => {
            const x = ((property.longitude + 122.4194) * 800) % window.innerWidth;
            const y = ((37.7749 - property.latitude) * 600) % window.innerHeight;
            
            return (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
                style={{
                  left: `${Math.max(50, Math.min(x, window.innerWidth - 50))}px`,
                  top: `${Math.max(50, Math.min(y, window.innerHeight - 50))}px`
                }}
                onClick={() => setSelectedProperty(property)}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`bg-white rounded-lg shadow-lg border-2 p-2 ${
                    selectedProperty?.id === property.id 
                      ? 'border-secondary shadow-xl' 
                      : 'border-primary hover:border-secondary'
                  } transition-all duration-200`}
                >
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Home" size={16} className="text-primary" />
                    <span className="font-semibold text-sm text-gray-900">
                      {formatPrice(property.price)}
                    </span>
                  </div>
                  
                  {/* Pin pointer */}
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
                </motion.div>
              </motion.div>
            );
          })}

          {/* Map Controls */}
          <div className="absolute top-4 right-4 z-20 space-y-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white p-3 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200"
              onClick={() => {
                toast.success('Zooming in...');
              }}
            >
              <ApperIcon name="Plus" size={20} className="text-gray-700" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white p-3 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200"
              onClick={() => {
                toast.success('Zooming out...');
              }}
            >
              <ApperIcon name="Minus" size={20} className="text-gray-700" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white p-3 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200"
              onClick={() => {
                // Recenter map
                if (properties.length > 0) {
                  setMapCenter({
                    lat: properties[0].latitude,
                    lng: properties[0].longitude
                  });
                  toast.success('Map recentered');
                }
              }}
            >
              <ApperIcon name="Crosshair" size={20} className="text-gray-700" />
            </motion.button>
          </div>

          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 z-20 bg-white p-4 rounded-lg shadow-lg">
            <h3 className="font-semibold text-sm text-gray-900 mb-2">Map Legend</h3>
            <div className="space-y-1 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-primary rounded border"></div>
                <span className="text-gray-600">Available Properties</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-secondary rounded border"></div>
                <span className="text-gray-600">Selected Property</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Property Details Sidebar */}
      <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {selectedProperty ? 'Property Details' : 'Properties on Map'}
            </h2>
            <span className="text-sm text-gray-500">
              {properties.length} properties
            </span>
          </div>

          {selectedProperty ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <PropertyCard property={selectedProperty} viewMode="list" />
              
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => setSelectedProperty(null)}
                  className="text-primary hover:text-primary/80 text-sm underline"
                >
                  ← Back to all properties
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600 text-sm mb-4">
                Click on any marker to view property details
              </p>
              
              {properties.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <ApperIcon name="MapPin" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No properties to display on map</p>
                </motion.div>
              ) : (
                <div className="space-y-3">
                  {properties.map((property, index) => (
                    <motion.div
                      key={property.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSelectedProperty(property)}
                      className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-900 truncate">
                            {property.title}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {property.address}
                          </p>
                          <p className="text-sm font-semibold text-secondary">
                            {formatPrice(property.price)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapView;