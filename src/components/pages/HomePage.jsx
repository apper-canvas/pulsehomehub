import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { propertyService } from '@/services';
import HeroSection from '@/components/organisms/HeroSection';
import FeaturedPropertiesSection from '@/components/organisms/FeaturedPropertiesSection';
import FeaturesSection from '@/components/organisms/FeaturesSection';

const HomePage = () => {
    const navigate = useNavigate();
    const [featuredProperties, setFeaturedProperties] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const loadFeaturedProperties = async () => {
            setLoading(true);
            try {
                const properties = await propertyService.getAll();
                // Get first 3 properties as featured
                setFeaturedProperties(properties.slice(0, 3));
            } catch (error) {
                console.error('Failed to load featured properties:', error);
            } finally {
                setLoading(false);
            }
        };

        loadFeaturedProperties();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            navigate('/browse');
        }
    };

    const handleStartBrowsing = () => {
        navigate('/browse');
    };

    return (
        <div className="min-h-screen bg-background">
            <HeroSection
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSearch={handleSearch}
                onStartBrowsing={handleStartBrowsing}
            />
            <FeaturedPropertiesSection
                properties={featuredProperties}
                loading={loading}
                onViewAll={handleStartBrowsing}
            />
            <FeaturesSection />
        </div>
    );
};

export default HomePage;