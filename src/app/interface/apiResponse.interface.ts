export interface ApiResponse<T> {
    data: T;
    message?: string;
    isSuccess: boolean;
}

export interface ApiErrorResponse {
    message: string;
    status: number;
}
