import React, { createContext, useContext, useState, useEffect } from 'react';
import config from '../config';
import { portfolioData } from '../data';

const DataContext = createContext(null);

export const usePortfolioData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('usePortfolioData must be used within a DataProvider');
    }
    return context;
};

export const DataProvider = ({ children }) => {
    const [data, setData] = useState(portfolioData); // Initialize with realistic fallback data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${config.API_URL}/public/data`);
                if (!response.ok) throw new Error('Failed to fetch data');
                let result = await response.json();
                
                // Helper to fix local upload URLs
                const baseUrl = config.API_URL.replace('/api', '');
                const fixUrl = (url) => (url && url.startsWith('/uploads/')) ? `${baseUrl}${url}` : url;

                if (result && Object.keys(result).length > 0) {
                    // Process Personal Info
                    if (result.personalInfo) {
                        result.personalInfo.profile_image = fixUrl(result.personalInfo.profile_image);
                    }
                    // Process Skills
                    if (result.skills) {
                        result.skills = result.skills.map(s => ({ ...s, icon_url: fixUrl(s.icon_url) }));
                    }
                    setData(result);
                }
            } catch (err) {
                console.warn(`[DATA_SYNC] Backend fetch failed or timed out. Falling back to static assets. Target: ${config.API_URL}`);
                
                // Process fallback data too
                const baseUrl = config.API_URL.replace('/api', '');
                const fixUrl = (url) => (url && url.startsWith('/uploads/')) ? `${baseUrl}${url}` : url;
                
                const fallbackData = { ...portfolioData };
                fallbackData.personalInfo.profile_image = fixUrl(fallbackData.personalInfo.profile_image);
                fallbackData.skills = fallbackData.skills.map(s => ({ ...s, icon_url: fixUrl(s.icon_url) }));
                
                setData(fallbackData);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    return (
        <DataContext.Provider value={{ data, loading, error }}>
            {children}
        </DataContext.Provider>
    );
};

