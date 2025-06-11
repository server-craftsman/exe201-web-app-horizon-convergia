import { useEffect, useRef } from "react";

function usePrevious<T>(value: T): T | undefined {
    const ref = useRef<T | undefined>(undefined);

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
}

// Việc theo dõi trạng thái trước đó của một giá trị là rất cần thiết 
// cho việc so sánh và các hoạt động animation, 
// điều này có thể thực hiện dễ dàng với hook usePrevious.

export default usePrevious;