export const API_PATH = {
    AUTH: {
        LOGIN: "/Auth/Login",
        LOGOUT: "/Auth/Logout",
        REGISTER: "/Auth/Register",
        FORGOT_PASSWORD: "/Auth/ForgotPassword",
        RESET_PASSWORD: "/Auth/ResetPassword"
    },
    USER: {
        GET_USER_PROFILE: "/Auth/whoami",
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