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
        CHANGE_PASSWORD: "/user/password/change",
        SEARCH_USERS: "/Users/search",
        ADMIN_CREATE: "/Users/admin-create",
        DELETE_USER: (id: string) => `/Users/${id}`,
        GET_USER_BY_ID: (id: string) => `/Users/${id}`,
        UPDATE_USER: (id: string) => `/Users/update/${id}`,
    },
    PRODUCT: {
        CREATE_PRODUCT: "/Products",
        CREATE_PRODUCT_BY_SELLER: (sellerId: string) => `/Products/${sellerId}`,
        // GET_PRODUCTS_BY_SELLER: (sellerId: string) => `/Products/seller/${sellerId}`,
        VERIFY_PRODUCT_BY_ADMIN: (id: string) => `/Products/verify/${id}`,
        ACTIVATE_PRODUCT: (productId: string) => `/Products/activate/${productId}`,
        SEND_PRODUCT_PAYMENT: (productId: string) => `/Products/send-payment-link/${productId}`,
        GET_ALL_PRODUCTS: "/Products",
        GET_ALL_PRODUCTS_UNVERIFIED: (sellerId: string) => `/Products/unverified-unpaid/${sellerId}`,
        GET_PRODUCT_BY_ID: (id: string) => `/Products/${id}`,
        UPDATE_PRODUCT: (id: string) => `/Products/${id}`,
        DELETE_PRODUCT: (id: string) => `/Products/${id}`
    },
    CATEGORY: {
        CREATE: "/Categories/",
        GET_ALL: "/Categories",
        GET_BY_ID: (id: string) => `/Categories/${id}`,
        UPDATE: (id: string) => `/Categories/${id}`,
        DELETE: (id: string) => `/Categories/${id}`
    }
};