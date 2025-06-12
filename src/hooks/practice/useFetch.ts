import { useState, useEffect } from "react";

function useFetch<T>(url: string) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(url);
                const result = await response.json();
                setData(result);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url]);

    return { data, loading, error };
}

// Lấy dữ liệu là một công việc phổ biến trong React. 
// Hook useFetch đóng gói logic lặp đi lặp lại, 
// giúp việc gọi API và quản lý trạng thái trở nên thanh thoát.

export default useFetch;