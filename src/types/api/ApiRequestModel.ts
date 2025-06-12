export interface ApiRequestModel {
    url: string;
    payload?: Record<string, any>;
    headers?: Record<string, string>;
    isLoading?: boolean;
    toggleLoading?: (isLoading: boolean) => void;
    toggleLoadingAdmin?: (isLoading: boolean) => void;
}