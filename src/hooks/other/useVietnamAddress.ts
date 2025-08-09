// src/hooks/useVietnamAddress.ts
import { useQuery } from "@tanstack/react-query";
import { BaseService } from "@app/api/base.service";

// Public VN address API endpoints
const VN_API = {
    ALL_DEPTH3: "https://provinces.open-api.vn/api/?depth=3",
    PROVINCES: "https://provinces.open-api.vn/api/p/",
    PROVINCE_WITH_DISTRICTS: (code: string) => `https://provinces.open-api.vn/api/p/${code}?depth=2`,
    DISTRICT_WITH_WARDS: (code: string) => `https://provinces.open-api.vn/api/d/${code}?depth=2`,
    // Fallback dataset (static JSON on GitHub)
    FALLBACK_JSON: "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json",
};

// Normalize fallback dataset shape → open-api-like
function normalizeFallback(list: any[]): any[] {
    try {
        return (list || []).map((p: any) => ({
            code: String(p.Id),
            name: p.Name,
            districts: (p.Districts || []).map((d: any) => ({
                code: String(d.Id),
                name: d.Name,
                wards: (d.Wards || []).map((w: any) => ({ code: String(w.Id), name: w.Name })),
            })),
        }));
    } catch {
        return [];
    }
}

export const useVietnamAddress = () => {
    // Load once: provinces + districts + wards (depth=3) with fallback
    const all = useQuery({
        queryKey: ["vn-address-all-depth3"],
        queryFn: async () => {
            try {
                const resp = await BaseService.get<any>({ url: VN_API.ALL_DEPTH3, isLoading: false });
                return resp.data as any[];
            } catch {
                const fb = await BaseService.get<any>({ url: VN_API.FALLBACK_JSON, isLoading: false });
                return normalizeFallback(fb.data as any[]);
            }
        },
        staleTime: Infinity,
        gcTime: Infinity,
    });

    // Provinces list
    const provinces = useQuery({
        queryKey: ["provinces"],
        queryFn: async () => {
            if (Array.isArray(all.data) && all.data.length) {
                return all.data.map((p: any) => ({ code: String(p.code), name: p.name }));
            }
            // fallback to per-endpoint if ALL not yet available
            const resp = await BaseService.get<any>({ url: VN_API.PROVINCES, isLoading: false });
            return resp.data;
        },
        enabled: true,
        staleTime: Infinity,
        gcTime: Infinity,
    });

    // Get districts by province code (derived from ALL cache)
    const getDistricts = (provinceCode: string) => {
        return useQuery({
            queryKey: ["districts", provinceCode],
            queryFn: async () => {
                if (!provinceCode) return [] as any[];
                if (Array.isArray(all.data) && all.data.length) {
                    const province = all.data.find((p: any) => String(p.code) === String(provinceCode));
                    return province?.districts?.map((d: any) => ({ code: String(d.code), name: d.name })) || [];
                }
                // Network fallback
                const resp = await BaseService.get<any>({ url: VN_API.PROVINCE_WITH_DISTRICTS(provinceCode), isLoading: false });
                return resp.data?.districts || [];
            },
            enabled: !!provinceCode,
            staleTime: Infinity,
            gcTime: Infinity,
        });
    };

    // Get wards by district code (derived from ALL cache)
    const getWards = (districtCode: string) => {
        return useQuery({
            queryKey: ["wards", districtCode],
            queryFn: async () => {
                if (!districtCode) return [] as any[];
                if (Array.isArray(all.data) && all.data.length) {
                    for (const p of all.data as any[]) {
                        const d = p.districts?.find((x: any) => String(x.code) === String(districtCode));
                        if (d) return d.wards?.map((w: any) => ({ code: String(w.code), name: w.name })) || [];
                    }
                    return [] as any[];
                }
                // Network fallback
                const resp = await BaseService.get<any>({ url: VN_API.DISTRICT_WITH_WARDS(districtCode), isLoading: false });
                return resp.data?.wards || [];
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
    ) => `${streetAddress}, ${wardName}, ${districtName}, ${provinceName}`;

    return { provinces, getDistricts, getWards, formatAddress };
};