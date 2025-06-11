import { useState, useEffect } from "react";

function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);

        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
}

// Quản lý các thao tác nhập liệu từ người dùng, 
// chẳng hạn như tìm kiếm hoặc các trường nhập form, 
// sẽ hiệu quả hơn với hook debounce, 
// giúp giảm các lần render không cần thiết và các call API.
export default useDebounce;