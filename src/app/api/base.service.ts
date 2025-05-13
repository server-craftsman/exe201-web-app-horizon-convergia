import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import type { ApiRequestModel } from "../../types/api/ApiRequestModel";
import { clearLocalStorage } from "../../utils/storage";
import { DOMAIN_API } from "../../consts/domain.const";
import { ROUTER_URL } from "../../consts/router.path.const";
import { store } from "../../app/store/redux";
import { toggleLoading } from "../../app/store/loading.slice";
import { HTTP_STATUS } from "../../app/enums";
import { HttpException } from "../../app/exceptions";
import { notificationMessage } from "../../utils/helper";
// import { handleUploadFile, deleteFileFromCloudinary } from "../../utils/upload"; // Import the handleUploadFile and deleteFileFromCloudinary functions

export const axiosInstance = axios.create({
    baseURL: DOMAIN_API,
    headers: {
        "content-type": "application/json; charset=UTF-8"
    },
    timeout: 300000,
    timeoutErrorMessage: `Connection is timeout exceeded`
});

export const BaseService = {
    get<T = any>({
        url,
        isLoading = true,
        payload,
        headers,
        toggleLoading
    }: Partial<ApiRequestModel> & {
        toggleLoading?: (isLoading: boolean) => void;
    }): Promise<PromiseState<T>> {
        if (toggleLoading) store.dispatch(toggleLoading(isLoading) as any);
        return axiosInstance
            .get<T, PromiseState<T>>(`${url}`, {
                params: payload,
                headers: headers || {}
            })
            .finally(() => {
                if (toggleLoading) toggleLoading(false);
            });
    },
    post<T = any>({ url, isLoading = true, payload, headers, toggleLoading }: Partial<ApiRequestModel>): Promise<PromiseState<T>> {
        if (toggleLoading) store.dispatch(toggleLoading(isLoading) as any);
        return axiosInstance
            .post<T, PromiseState<T>>(`${url}`, payload, {
                headers: headers || {}
            })
            .finally(() => {
                if (toggleLoading) toggleLoading(false);
            });
    },
    put<T = any>({
        url,
        isLoading = true,
        payload,
        headers,
        toggleLoading
    }: Partial<ApiRequestModel> & {
        toggleLoading?: (isLoading: boolean) => void;
    }): Promise<PromiseState<T>> {
        if (toggleLoading) store.dispatch(toggleLoading(isLoading) as any);
        return axiosInstance
            .put<T, PromiseState<T>>(`${url}`, payload, {
                headers: headers || {}
            })
            .finally(() => {
                if (toggleLoading) toggleLoading(false);
            });
    },
    remove<T = any>({
        url,
        isLoading = true,
        payload,
        headers,
        toggleLoading
    }: Partial<ApiRequestModel> & {
        toggleLoading?: (isLoading: boolean) => void;
    }): Promise<PromiseState<T>> {
        if (toggleLoading) store.dispatch(toggleLoading(isLoading) as any);
        return axiosInstance
            .delete<T, PromiseState<T>>(`${url}`, {
                params: payload,
                headers: headers || {}
            })
            .finally(() => {
                if (toggleLoading) toggleLoading(false);
            });
    },
    getById<T = any>({
        url,
        isLoading = true,
        payload,
        headers,
        toggleLoading
    }: Partial<ApiRequestModel> & {
        toggleLoading?: (isLoading: boolean) => void;
    }): Promise<PromiseState<T>> {
        if (toggleLoading) store.dispatch(toggleLoading(isLoading) as any);
        return axiosInstance
            .get<T, PromiseState<T>>(`${url}`, {
                params: payload,
                headers: headers || {}
            })
            .finally(() => {
                if (toggleLoading) toggleLoading(false);
            });
    },
    // uploadMedia(url: string, file?: any, isMultiple: boolean = false, isLoading: boolean = true) {
    //     const formData = new FormData();
    //     if (isMultiple) {
    //         for (let i = 0; i < file.length; i++) {
    //             formData.append("files[]", file[i]);
    //         }
    //     } else {
    //         formData.append("file", file);
    //     }
    //     const user: any = getItemInLocalStorage(LOCAL_STORAGE.ACCOUNT_ADMIN);
    //     // if (isLoading) useToggleLoading()(true);
    //     if (isLoading) store.dispatch(toggleLoading(true) as any);
    //     return axios({
    //         method: "post",
    //         url: `${DOMAIN_ADMIN}${url}`,
    //         data: formData,
    //         params: {},
    //         headers: {
    //             "content-type": "multipart/form-data",
    //             Authorization: `Bearer ${user.access_token}`
    //         }
    //     })
    //         .then((res) => {
    //             // useToggleLoading()(false);
    //             return res.data;
    //         })
    //         .catch((error) => {
    //             handleErrorByToast(error);
    //             return null;
    //         });
    // },
    // uploadFile: async (file: File, type: "video" | "image", isLoading: boolean = true) => {
    //     if (isLoading) store.dispatch(toggleLoading(true) as any);

    //     try {
    //         const url = await handleUploadFile(file, type);
    //         if (url) {
    //             notificationMessage(`${type} uploaded successfully`);
    //             return url;
    //         } else {
    //             throw new Error("Upload failed");
    //         }
    //     } catch (error) {
    //         console.error("Upload error:", error);
    //         notificationMessage(error instanceof Error ? error.message : "Upload failed", "error");
    //         return null;
    //     } finally {
    //         if (isLoading) store.dispatch(toggleLoading(false));
    //     }
    // },
    // deleteFile: async (publicId: string, type: "video" | "image", isLoading: boolean = true) => {
    //     if (isLoading) store.dispatch(toggleLoading(true) as any);
    //     try {
    //         const success = await deleteFileFromCloudinary(publicId, type);
    //         if (success) {
    //             notificationMessage(`${type} deleted successfully`);
    //             return true;
    //         } else {
    //             throw new Error("Delete failed");
    //         }
    //     } catch (error) {
    //         console.error("Delete error:", error);
    //         notificationMessage(error instanceof Error ? error.message : "Delete failed", "error");
    //         return false;
    //     } finally {
    //         if (isLoading) store.dispatch(toggleLoading(false));
    //     }
    // }
};

export interface PromiseState<T = unknown> extends AxiosResponse<T> {
    totalItem: number;
}

axiosInstance.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        const token = localStorage.getItem("token");
        const userInfo = localStorage.getItem("userInfo");
        if (!config.headers) config.headers = {};
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        if (userInfo) {
            const parsedUserInfo = JSON.parse(userInfo);
            config.headers["User-Id"] = parsedUserInfo._id; // debug add user id
        }
        store.dispatch(toggleLoading(true)); // Show loading
        return config as InternalAxiosRequestConfig;
    },
    (err) => {
        setTimeout(() => store.dispatch(toggleLoading(false)), 2000); // Hide loading with delay
        return handleErrorByToast(err);
    }
);

axiosInstance.interceptors.response.use(
    (config) => {
        store.dispatch(toggleLoading(false)); // Hide loading
        return Promise.resolve(config);
    },
    (err) => {
        setTimeout(() => store.dispatch(toggleLoading(false)), 2000); // Hide loading on error with delay
        const { response } = err;
        if (response) {
            switch (response.status) {
                case HTTP_STATUS.UNAUTHORIZED:
                    clearLocalStorage();
                    setTimeout(() => {
                        window.location.href = ROUTER_URL.AUTH.LOGIN;
                    }, 3000);
                    break;
                case HTTP_STATUS.FORBIDDEN:
                    notificationMessage("Access denied. You do not have permission to perform this action.", "error");
                    clearLocalStorage();
                    setTimeout(() => {
                        window.location.href = ROUTER_URL.AUTH.LOGIN;
                    }, 3000);
                    break;
                case HTTP_STATUS.NOT_FOUND:
                    notificationMessage("Requested resource not found.", "error");
                    // setTimeout(() => {
                    //   window.location.href = ROUTER_URL.LOGIN;
                    // }, 2000);
                    break;
                case HTTP_STATUS.INTERNAL_SERVER_ERROR:
                    notificationMessage("Internal server error. Please try again later.", "error");
                    break;
                default:
                    notificationMessage(response.data?.message || "An error occurred. Please try again.", "error");
            }
        } else {
            notificationMessage(err.message || "An error occurred. Please try again.", "error");
        }
        return Promise.reject(new HttpException(err.message, response?.status || HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
);

const handleErrorByToast = (error: any) => {
    const message = error.response?.data?.message || error.message;
    notificationMessage(message, "error");
    return Promise.reject(error);
};