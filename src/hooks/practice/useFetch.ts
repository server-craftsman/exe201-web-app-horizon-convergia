import { useQuery, useMutation, useQueryClient } from "react-query";

/**
 * Hook for fetching data
 * @param {Object} options - Options for the hook
 * @param {string[]} options.queryKey - Key for the query
 * @param {Function} options.queryFn - Function to fetch the data
 * @param {boolean} [options.enabled=false] - Whether the query is enabled
 * @param {number} [options.staleTime=0] - Time in milliseconds after which the query is considered stale
 * @param {number} [options.cacheTime=5 * 60 * 1000] - Time in milliseconds after which the query is garbage collected
 * @param {Function} [options.onSuccess] - Callback when the query is successful
 * @param {Function} [options.onError] - Callback when the query fails
 * @returns {Object} - An object with the data, isLoading, isError, error, and refetch
 */
export function useFetch<T>({
                                queryKey,
                                queryFn,
                                enabled = true,
                                staleTime = 0,
                                cacheTime = 5 * 60 * 1000,
                                onSuccess,
                                onError,
                            }: {
    queryKey: string[];
    queryFn: () => Promise<T>;
    enabled?: boolean;
    staleTime?: number;
    cacheTime?: number;
    onSuccess?: (data: T) => void;
    onError?: (error: any) => void;
}): {
    data: T | undefined;
    isLoading: boolean;
    isError: boolean;
    error: any;
    refetch: () => Promise<any>;
} {
    const { data, isLoading, isError, error, refetch } = useQuery<T>({
        queryKey,
        queryFn,
        enabled,
        staleTime,
        cacheTime,
        onSuccess,
        onError,
    });

    return {
        data,
        isLoading,
        isError,
        error,
        refetch,
    };
}

/**
 * Hook for mutating data
 * @param {Object} options - Options for the hook
 * @param {Function} options.mutationFn - The mutation function
 * @param {Function} [options.onSuccess] - Callback when the mutation is successful
 * @param {Function} [options.onError] - Callback when the mutation fails
 * @param {Function} [options.onSettled] - Callback when the mutation settles
 * @param {string[][]} [options.invalidateQueries] - Queries to invalidate after the mutation
 * @returns {Object} - An object with the mutate function
 */
export function useMutate<T, V = void>({
                                           mutationFn,
                                           onSuccess,
                                           onError,
                                           onSettled,
                                           invalidateQueries = [],
                                       }: {
    mutationFn: (variables: V) => Promise<T>;
    onSuccess?: (data: T, variables: V) => void;
    onError?: (error: any, variables: V) => void;
    onSettled?: (data: T | undefined, error: any, variables: V) => void;
    invalidateQueries?: string[][];
}): {
    mutate: (variables: V) => Promise<T | undefined>;
} {
    const queryClient = useQueryClient();

    const { mutate } = useMutation<T, any, V>({
        mutationFn,
        onSuccess: (data, variables) => {
            // Invalidate and refetch related queries
            if (invalidateQueries.length > 0) {
                invalidateQueries.forEach((queryKey) => {
                    queryClient.invalidateQueries({ queryKey });
                });
            }
            onSuccess?.(data, variables);
        },
        onError: (error, variables) => {
            onError?.(error, variables);
        },
        onSettled: (data, error, variables) => {
            onSettled?.(data, error, variables);
        },
    });

    return {
        mutate: async (variables: V): Promise<T | undefined> => {
            try {
                const result = await mutate(variables);
                return result as T | undefined;
            } catch (error) {
                console.error("Mutation error:", error);
                throw error;
            }
        }
    }
}
