export const getItemInLocalStorage = (key: string) => localStorage.getItem(key);
export const removeItemInLocalStorage = (key: string) => localStorage.removeItem(key);
export const clearLocalStorage = () => localStorage.clear();