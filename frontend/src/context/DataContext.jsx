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
            const baseUrl = config.API_URL.replace('/api', '');
            const fixUrlForBackend = (url) => (url && url.startsWith('/uploads/')) ? `${baseUrl}${url}` : url;

            try {
                const response = await fetch(`${config.API_URL}/public/data`);
                if (!response.ok) throw new Error('Failed to fetch data');
                let result = await response.json();
                
                if (result && Object.keys(result).length > 0) {
                    // Process Personal Info from Backend
                    if (result.personalInfo) {
                        result.personalInfo.profile_image = fixUrlForBackend(result.personalInfo.profile_image);
                    }
                    // Process Skills from Backend
                    if (result.skills) {
                        result.skills = result.skills.map(s => ({ ...s, icon_url: fixUrlForBackend(s.icon_url) }));
                    }
                    setData(result);
                }
            } catch (err) {
                console.warn(`[DATA_SYNC] Backend fetch failed. Falling back to frontend assets. Target: ${config.API_URL}`);
                
                // Fallback data uses relative paths (which work from frontend public/uploads)
                setData({ ...portfolioData });
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

