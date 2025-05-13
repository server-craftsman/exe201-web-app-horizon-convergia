import { useState } from "react";

function useToggle(initialState = false) {
    const [state, setState] = useState(initialState);

    const toggle = () => setState(prev => !prev);

    return [state, toggle] as const;
}

// Quản lý trạng thái toggle cho các modal, dropdowns, 
// hoặc chuyển đổi giao diện thật dễ dàng với hook useToggle, 
// giúp code của bạn sạch sẽ và sử dụng lại được.
export default useToggle;