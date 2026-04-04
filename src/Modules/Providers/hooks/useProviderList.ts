import { useQuery } from "@tanstack/react-query";
import { getProviderList } from "../../../Apis/modules/providers/providers.api";
import type { Provider, Pagination } from "../../../Apis/modules/providers/providers.types";

export interface UseProviderListFilters {
    search?: string;
    purpose?: string;
    pageNumber?: number;
    pageSize?: number;
}

export const useProviderList = (filters?: UseProviderListFilters) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["providers", filters?.search, filters?.purpose, filters?.pageNumber, filters?.pageSize],
        queryFn: () => getProviderList(undefined, undefined, filters),
        select: (response) => ({

            providers: response.providers,
            pagination: response.pagination,
        }),
    });
    console.log("useProviderList - data:", data,);

    return {
        providers: data?.providers,
        pagination: data?.pagination,
        isLoading,
        error,
    };
};

export type { Provider, Pagination };