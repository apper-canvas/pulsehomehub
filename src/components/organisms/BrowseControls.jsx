import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const BrowseControls = ({
    showFilters,
    onToggleFilters,
    propertyCount,
    hasActiveFilters,
    onClearFilters,
    sortBy,
    onSortChange,
    viewMode,
    onViewModeChange,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0"
        >
            <div className="flex items-center space-x-4">
                <Button
                    onClick={onToggleFilters}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-2"
                >
                    <ApperIcon name="Filter" size={18} />
                    <span>Filters</span>
                    {hasActiveFilters && (
                        <span className="bg-secondary text-white text-xs px-2 py-1 rounded-full">!</span>
                    )}
                </Button>

                <div className="flex items-center space-x-2">
                    <span className="text-gray-600">
                        {propertyCount} {propertyCount === 1 ? 'property' : 'properties'}
                    </span>
                    {hasActiveFilters && (
                        <Button
                            onClick={onClearFilters}
                            className="text-secondary hover:text-secondary/80 text-sm underline"
                        >
                            Clear filters
                        </Button>
                    )}
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <select
                    value={sortBy}
                    onChange={onSortChange}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="beds">Most Bedrooms</option>
                    <option value="size">Largest First</option>
                </select>

                <div className="hidden sm:flex bg-gray-100 rounded-lg p-1">
                    <Button
                        onClick={() => onViewModeChange('grid')}
                        className={`p-2 rounded-md transition-colors duration-200 ${
                            viewMode === 'grid' ? 'bg-white shadow-sm text-primary' : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        <ApperIcon name="Grid3X3" size={18} />
                    </Button>
                    <Button
                        onClick={() => onViewModeChange('list')}
                        className={`p-2 rounded-md transition-colors duration-200 ${
                            viewMode === 'list' ? 'bg-white shadow-sm text-primary' : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        <ApperIcon name="List" size={18} />
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

export default BrowseControls;