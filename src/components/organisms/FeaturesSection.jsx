import React from 'react';
import { motion } from 'framer-motion';
import FeatureCard from '@/components/molecules/FeatureCard';

const FEATURES_DATA = [
    {
        icon: 'Search',
        title: 'Smart Search',
        description: 'Advanced filters and search capabilities to find exactly what you\'re looking for'
    },
    {
        icon: 'Map',
        title: 'Interactive Maps',
        description: 'Explore neighborhoods and view properties on detailed interactive maps'
    },
    {
        icon: 'Heart',
        title: 'Save Favorites',
        description: 'Keep track of properties you love and compare them side by side'
    }
];

const FeaturesSection = () => {
    return (
        <section className="py-16 px-4 bg-white">
            <div className="container mx-auto max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="font-display text-4xl font-bold text-gray-900 mb-4">
                        Why Choose HomeHub?
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Powerful tools and comprehensive data to help you make informed decisions
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {FEATURES_DATA.map((feature, index) => (
                        <FeatureCard
                            key={feature.title}
                            iconName={feature.icon}
                            title={feature.title}
                            description={feature.description}
                            delay={index * 0.1}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;