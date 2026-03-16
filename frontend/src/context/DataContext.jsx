import React, { createContext, useContext, useState, useEffect } from 'react';
import config from '../config';

const DataContext = createContext(null);

export const usePortfolioData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('usePortfolioData must be used within a DataProvider');
    }
    return context;
};

export const DataProvider = ({ children }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${config.API_URL}/public/data`);
                if (!response.ok) throw new Error('Failed to fetch data');
                const result = await response.json();
                setData(result);
            } catch (err) {
                console.error("Error fetching dynamic data:", err);
                setError(err.message);
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
