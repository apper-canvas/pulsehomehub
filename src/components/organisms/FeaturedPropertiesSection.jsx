import React from 'react';
import { motion } from 'framer-motion';
import PropertyCard from '@/components/PropertyCard';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const FeaturedPropertiesSection = ({ properties, loading, onViewAll }) => {
    return (
        <section className="py-16 px-4">
            <div className="container mx-auto max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="font-display text-4xl font-bold text-gray-900 mb-4">
                        Featured Properties
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Handpicked homes that offer exceptional value and desirable features
                    </p>
                </motion.div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(3)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-lg shadow-card overflow-hidden"
                            >
                                <div className="animate-pulse">
                                    <div className="h-64 bg-gray-200"></div>
                                    <div className="p-6 space-y-4">
                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {properties.map((property, index) => (
                            <motion.div
                                key={property.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <PropertyCard property={property} />
                            </motion.div>
                        ))}
                    </div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center mt-12"
                >
                    <Button
                        onClick={onViewAll}
                        className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors duration-200 inline-flex items-center space-x-2"
                    >
                        <span>View All Properties</span>
                        <ApperIcon name="ArrowRight" size={18} />
                    </Button>
                </motion.div>
            </div>
        </section>
    );
};

export default FeaturedPropertiesSection;