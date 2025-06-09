import React from 'react';
import { motion } from 'framer-motion';
import PropertyCard from '@/components/PropertyCard';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const PropertiesGridList = ({ properties, viewMode, hasActiveFilters, onClearFilters }) => {
    return (
        <div className="properties-results">
            {properties.length === 0 ? (
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
                        {hasActiveFilters
                            ? "Try adjusting your filters to see more results"
                            : "No properties match your search criteria"
                        }
                    </p>
                    {hasActiveFilters && (
                        <Button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onClearFilters}
                            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors duration-200"
                        >
                            Clear All Filters
                        </Button>
                    )}
                </motion.div>
            ) : (
                <div className={`grid gap-6 ${
                    viewMode === 'grid'
                        ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                        : 'grid-cols-1'
                }`}>
                    {properties.map((property, index) => (
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
    );
};

export default PropertiesGridList;