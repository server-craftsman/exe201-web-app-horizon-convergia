export const API_PATH = {
    AUTH: {
        LOGIN: "/auth/login",
        LOGOUT: "/auth/logout",
        REGISTER: "/auth/register",
        FORGOT_PASSWORD: "/auth/forgot-password",
        RESET_PASSWORD: "/auth/reset-password"
    },
    USER: {
        GET_USER_PROFILE: "/user/profile",
        UPDATE_USER_PROFILE: "/user/profile/update",
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