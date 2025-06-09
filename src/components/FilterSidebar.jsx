import { motion } from 'framer-motion';
import ApperIcon from './ApperIcon';

const FilterSidebar = ({ filters, onFiltersChange, onClearFilters, inline = false }) => {
  const propertyTypes = ['House', 'Condo', 'Townhouse', 'Apartment', 'Land'];

  const handleInputChange = (field, value) => {
    onFiltersChange({
      ...filters,
      [field]: value
    });
  };

  const handleCheckboxChange = (field, value, checked) => {
    const currentValues = filters[field] || [];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter(v => v !== value);
    
    onFiltersChange({
      ...filters,
      [field]: newValues
    });
  };

  const hasActiveFilters = () => {
    return filters.priceMin || 
           filters.priceMax || 
           filters.propertyTypes.length > 0 || 
           filters.bedroomsMin || 
           filters.bathroomsMin || 
           filters.squareFeetMin;
  };

  const containerClass = inline 
    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
    : "h-full overflow-y-auto p-6 space-y-6";

  return (
    <div className={containerClass}>
      {/* Header */}
      {!inline && (
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg text-gray-900">Filters</h2>
          {hasActiveFilters() && (
            <button
              onClick={onClearFilters}
              className="text-secondary hover:text-secondary/80 text-sm underline"
            >
              Clear All
            </button>
          )}
        </div>
      )}

      {/* Price Range */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        <h3 className="font-medium text-gray-900 flex items-center space-x-2">
          <ApperIcon name="DollarSign" size={16} className="text-primary" />
          <span>Price Range</span>
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Min Price</label>
            <input
              type="number"
              placeholder="Any"
              value={filters.priceMin}
              onChange={(e) => handleInputChange('priceMin', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Max Price</label>
            <input
              type="number"
              placeholder="Any"
              value={filters.priceMax}
              onChange={(e) => handleInputChange('priceMax', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
      </motion.div>

      {/* Property Type */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-3"
      >
        <h3 className="font-medium text-gray-900 flex items-center space-x-2">
          <ApperIcon name="Home" size={16} className="text-primary" />
          <span>Property Type</span>
        </h3>
        <div className="space-y-2">
          {propertyTypes.map((type) => (
            <label key={type} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.propertyTypes.includes(type)}
                onChange={(e) => handleCheckboxChange('propertyTypes', type, e.target.checked)}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
              />
              <span className="text-sm text-gray-700">{type}</span>
            </label>
          ))}
        </div>
      </motion.div>

      {/* Bedrooms */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        <h3 className="font-medium text-gray-900 flex items-center space-x-2">
          <ApperIcon name="Bed" size={16} className="text-primary" />
          <span>Bedrooms</span>
        </h3>
        <select
          value={filters.bedroomsMin}
          onChange={(e) => handleInputChange('bedroomsMin', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
          <option value="5">5+</option>
        </select>
      </motion.div>

      {/* Bathrooms */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        <h3 className="font-medium text-gray-900 flex items-center space-x-2">
          <ApperIcon name="Bath" size={16} className="text-primary" />
          <span>Bathrooms</span>
        </h3>
        <select
          value={filters.bathroomsMin}
          onChange={(e) => handleInputChange('bathroomsMin', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="">Any</option>
          <option value="1">1+</option>
          <option value="1.5">1.5+</option>
          <option value="2">2+</option>
          <option value="2.5">2.5+</option>
          <option value="3">3+</option>
          <option value="3.5">3.5+</option>
          <option value="4">4+</option>
        </select>
      </motion.div>

      {/* Square Footage */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-3"
      >
        <h3 className="font-medium text-gray-900 flex items-center space-x-2">
          <ApperIcon name="Square" size={16} className="text-primary" />
          <span>Min Square Feet</span>
        </h3>
        <input
          type="number"
          placeholder="Any"
          value={filters.squareFeetMin}
          onChange={(e) => handleInputChange('squareFeetMin', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </motion.div>

      {/* Clear Filters Button - for inline mode */}
      {inline && hasActiveFilters() && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-end"
        >
          <button
            onClick={onClearFilters}
            className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <ApperIcon name="RotateCcw" size={16} />
            <span>Clear Filters</span>
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default FilterSidebar;