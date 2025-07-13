import { useQuery } from '@tanstack/react-query';

interface Bank {
    id: string;
    name: string;
    code: string;
    logo?: string;
}

interface BankResponse {
    data: Bank[];
    success: boolean;
    message: string;
}

const fetchBanks = async (): Promise<BankResponse> => {
    // Using a public API for Vietnamese banks
    const response = await fetch('https://api.vietqr.io/v2/banks');

    if (!response.ok) {
        throw new Error('Failed to fetch banks');
    }

    const data = await response.json();

    // Transform the response to match our interface
    return {
        data: data.data?.map((bank: any) => ({
            id: bank.id,
            name: bank.name,
            code: bank.code,
            logo: bank.logo
        })) || [],
        success: true,
        message: 'Banks fetched successfully'
    };
};

export const useBank = () => {
    const {
        data: banks,
        isLoading,
        error,
        refetch
    } = useQuery({
        queryKey: ['banks'],
        queryFn: fetchBanks,
        select: (data) => data.data,
        staleTime: 24 * 60 * 60 * 1000, // 24 hours
        gcTime: 24 * 60 * 60 * 1000, // 24 hours
        retry: 2,
        retryDelay: 1000,
    });

    return {
        banks: banks || [],
        isLoading,
        error,
        refetch
    };
};

export default useBank;
