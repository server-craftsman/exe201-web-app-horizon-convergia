import { useEffect, useRef } from "react";

function useClickOutside(handler: () => void) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                handler();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [handler]);

    return ref;
}

// Hoàn hảo để đóng modal hoặc dropdown khi người dùng click ra ngoài, 
// sử dụng hook useClickOutside để mang đến trải nghiệm người dùng tốt hơn.

export default useClickOutside;