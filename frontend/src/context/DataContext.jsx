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
            const fixUrl = (url) => (url && url.startsWith('/uploads/')) ? `${baseUrl}${url}` : url;

            try {
                const response = await fetch(`${config.API_URL}/public/data`);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const result = await response.json();

                // KEY GUARD: only use backend data if it actually has projects.
                // If backend returns empty projects (e.g. DB not yet seeded on prod),
                // we keep the local fallback so the page is never blank.
                const hasProjects = result?.projects && result.projects.length > 0;

                if (hasProjects) {
                    // Fix upload URLs to point at the live backend
                    if (result.personalInfo) {
                        result.personalInfo.profile_image = fixUrl(result.personalInfo.profile_image);
                    }
                    if (result.skills) {
                        result.skills = result.skills.map(s => ({ ...s, icon_url: fixUrl(s.icon_url) }));
                    }

                    // Merge with fallback so fields like 'services' are always present
                    setData({ ...portfolioData, ...result });
                } else {
                    // Backend connected but DB is empty — keep local fallback silently
                    console.info('[DATA_SYNC] Backend returned no projects. Using local fallback.');
                }
            } catch (err) {
                // Network failure or backend offline — local fallback is already in state
                console.warn(`[DATA_SYNC] Backend unreachable. Using local fallback. (${err.message})`);
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

