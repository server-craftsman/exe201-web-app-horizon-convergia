export const API_PATH = {
    AUTH: {
        LOGIN: "/Auth/Login",
        LOGOUT: "/Auth/Logout",
        REGISTER: "/Auth/register",
        FORGOT_PASSWORD: "/Auth/forgot-password",
        RESET_PASSWORD: "/Auth/reset-password",
        CURRENT_USER: "/Auth/whoami",
        VERIFY_EMAIL: "/Auth/verify-email",
        CHANGE_PASSWORD: (id: string) => `/Auth/${id}/change-password`,
        GOOGLE_LOGIN: "/Auth/google-login",
        GOOGLE_CALLBACK: "/Auth/google-response",
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
    },
    CATEGORY: {
        CREATE: "/Categories/",
        GET_ALL: "/Categories",
        GET_BY_ID: (id: string) => `/Categories/${id}`,
        UPDATE: (id: string) => `/Categories/${id}`,
        DELETE: (id: string) => `/Categories/${id}`
    }
};