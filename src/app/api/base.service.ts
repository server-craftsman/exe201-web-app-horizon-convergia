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
import { helpers, upload } from "../../utils";

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
    uploadFile: async (file: File, type: "video" | "image", isLoading: boolean = true) => {
        if (isLoading) store.dispatch(toggleLoading(true) as any);

        try {
            const url = await upload.handleUploadFile(file, type);
            if (url) {
                helpers.notificationMessage(`File tải lên thành công`);
                return url;
            } else {
                throw new Error("Upload failed");
            }
        } catch (error) {
            console.error("Upload error:", error);
            helpers.notificationMessage(error instanceof Error ? error.message : "Upload failed", "error");
            return null;
        } finally {
            if (isLoading) store.dispatch(toggleLoading(false));
        }
    },
    deleteFile: async (publicId: string, type: "video" | "image", isLoading: boolean = true) => {
        if (isLoading) store.dispatch(toggleLoading(true) as any);
        try {
            const success = await upload.deleteFileFromCloudinary(publicId, type);
            if (success) {
                helpers.notificationMessage(`${type} deleted successfully`);
                return true;
            } else {
                throw new Error("Delete failed");
            }
        } catch (error) {
            console.error("Delete error:", error);
            helpers.notificationMessage(error instanceof Error ? error.message : "Delete failed", "error");
            return false;
        } finally {
            if (isLoading) store.dispatch(toggleLoading(false));
        }
    }
};

export interface PromiseState<T = unknown> extends AxiosResponse<T> {
    totalItem: number;
}

axiosInstance.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        const token = localStorage.getItem("accessToken");

        if (!config.headers) config.headers = {};

        // Compute target host; only attach Authorization for our API host
        try {
            const finalUrl = (config.url || '').startsWith('http')
                ? (config.url as string)
                : `${config.baseURL || ''}${config.url || ''}`;
            const targetHost = new URL(finalUrl).host;
            const apiHost = new URL(DOMAIN_API).host;
            if (token && targetHost === apiHost) {
                (config.headers as any)["Authorization"] = `Bearer ${token}`;
            } else {
                delete (config.headers as any)["Authorization"];
            }
        } catch {
            // If parsing fails, do not attach auth header
            delete (config.headers as any)["Authorization"];
        }

        // Remove content-type for GET/DELETE to avoid 415 on some servers
        const method = config.method?.toLowerCase();
        if (method === "get" || method === "delete") {
            delete (config.headers as any)["content-type"];
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
                    helpers.notificationMessage("Bạn không có quyền truy cập vào trang này.", "error");
                    clearLocalStorage();
                    setTimeout(() => {
                        window.location.href = ROUTER_URL.AUTH.LOGIN;
                    }, 3000);
                    break;
                case HTTP_STATUS.NOT_FOUND:
                    helpers.notificationMessage("Trang bạn đang tìm kiếm không tồn tại.", "error");
                    // setTimeout(() => {
                    //     window.location.href = ROUTER_URL.AUTH.LOGIN;
                    // }, 2000);
                    break;
                case HTTP_STATUS.INTERNAL_SERVER_ERROR:
                    helpers.notificationMessage("Lỗi máy chủ. Vui lòng thử lại sau.", "error");
                    break;
                default:
                    helpers.notificationMessage(response.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại.", "error");
            }
        } else {
            helpers.notificationMessage(err.message || "Đã xảy ra lỗi. Vui lòng thử lại.", "error");
        }
        return Promise.reject(new HttpException(err.message, response?.status || HTTP_STATUS.INTERNAL_SERVER_ERROR));
    }
);

const handleErrorByToast = (error: any) => {
    const message = error.response?.data?.message || error.message;
    helpers.notificationMessage(message, "error");
    return Promise.reject(error);
};