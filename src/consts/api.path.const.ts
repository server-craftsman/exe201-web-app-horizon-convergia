export const API_PATH = {
    AUTH: {
        LOGIN: "/Auth/Login",
        LOGOUT: "/Auth/Logout",
        REGISTER: "/Auth/Register",
        FORGOT_PASSWORD: "/Auth/ForgotPassword",
        RESET_PASSWORD: "/Auth/ResetPassword",
        CURRENT_USER: "/Auth/whoami"
    },
    USER: {
        GET_USER_PROFILE: "/user/profile",
        UPDATE_USER_PROFILE: "/Users/update/:id",
        CHANGE_PASSWORD: "/user/password/change"
    },
    PRODUCT: {
        GET_ALL_PRODUCTS: "/products",
        GET_PRODUCT_BY_ID: (id: string) => `/products/${id}`,
        CREATE_PRODUCT: "/products/create",
        UPDATE_PRODUCT: (id: string) => `/products/update/${id}`,
        DELETE_PRODUCT: (id: string) => `/products/delete/${id}`
    }
};