import { useCallback } from "react";

export const useLocalStorage = () => {
    const setItem = useCallback((key: string, value: string) => {
        try {
            if (!key || !value) {
                console.warn('Invalid key or value for localStorage');
                return;
            }
            localStorage.setItem(key, value);
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            throw new Error('Failed to save data to localStorage');
        }
    }, []);

    const getItem = useCallback((key: string) => {
        try {
            if (!key) {
                console.warn('Invalid key for localStorage');
                return null;
            }
            return localStorage.getItem(key);
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    }, []);

    const removeItem = useCallback((key: string) => {
        try {
            if (!key) {
                console.warn('Invalid key for localStorage');
                return;
            }
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            throw new Error('Failed to remove data from localStorage');
        }
    }, []);

    return { setItem, getItem, removeItem };
}
