import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import SearchBar from '@/components/molecules/SearchBar';
import Button from '@/components/atoms/Button';

const HeroSection = ({ searchQuery, setSearchQuery, onSearch, onStartBrowsing }) => {
    return (
        <section className="relative bg-gradient-to-br from-primary to-primary/80 text-white py-24 px-4">
            <div className="container mx-auto max-w-6xl text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
                        Find Your Dream Home
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
                        Discover perfect properties with our comprehensive search tools and expert insights
                    </p>
                </motion.div>

                <SearchBar
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onSubmit={onSearch}
                    placeholder="Search by city, address, or zip code..."
                    formClassName="max-w-2xl mx-auto mb-8"
                    inputClassName="w-full px-6 py-4 pr-16 text-gray-900 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                    buttonClassName="absolute right-2 top-2 bottom-2 px-6 bg-secondary text-white rounded-md hover:bg-secondary/90 transition-colors duration-200 flex items-center justify-center"
                    motionDelay={0.2}
                />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <Button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onStartBrowsing}
                        className="bg-secondary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-secondary/90 transition-colors duration-200 inline-flex items-center space-x-2"
                    >
                        <span>Start Browsing Properties</span>
                        <ApperIcon name="ArrowRight" size={20} />
                    </Button>
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection;