// src/hooks/useVietnamAddress.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// interface Province {
//     code: string;
//     name: string;
// }
//
// interface District {
//     code: string;
//     name: string;
//     province_code: string;
// }
//
// interface Ward {
//     code: string;
//     name: string;
//     district_code: string;
// }

export const useVietnamAddress = () => {
    // Get all provinces
    const provinces = useQuery({
        queryKey: ["provinces"],
        queryFn: async () => {
            const response = await axios.get("https://provinces.open-api.vn/api/p/");
            return response.data;
        },
        staleTime: Infinity,
        gcTime: Infinity,
    });

    // Get districts by province code
    const getDistricts = (provinceCode: string) => {
        return useQuery({
            queryKey: ["districts", provinceCode],
            queryFn: async () => {
                if (!provinceCode) return [];
                const response = await axios.get(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
                return response.data.districts;
            },
            enabled: !!provinceCode,
            staleTime: Infinity,
            gcTime: Infinity,
        });
    };

    // Get wards by district code
    const getWards = (districtCode: string) => {
        return useQuery({
            queryKey: ["wards", districtCode],
            queryFn: async () => {
                if (!districtCode) return [];
                const response = await axios.get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
                return response.data.wards;
            },
            enabled: !!districtCode,
            staleTime: Infinity,
            gcTime: Infinity,
        });
    };

    // Format full address from selected values
    const formatAddress = (
        streetAddress: string,
        wardName: string,
        districtName: string,
        provinceName: string
    ) => {
        return `${streetAddress}, ${wardName}, ${districtName}, ${provinceName}`;
    };

    return {
        provinces,
        getDistricts,
        getWards,
        formatAddress,
    };
};