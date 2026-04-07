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
                const result = await response.json();
                
                // If the backend returns data, prioritize it
                if (result && Object.keys(result).length > 0) {
                    setData(result);
                }
            } catch (err) {
                console.warn(`[DATA_SYNC] Backend fetch failed, using fallback data. Target: ${config.API_URL}`);
                // We don't set a hard error here anymore, because we have a reliable fallback
                // This prevents the "disappearing" UI issue.
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

