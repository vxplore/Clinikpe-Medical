import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "../../../Apis/modules/dashboard/dashboard.api";
import type { DashboardData } from "../../../Apis/modules/dashboard/dashboard.types";

export function useDashboardStats() {
    const query = useQuery<DashboardData>({
        queryKey: ["dashboardStats"],
        queryFn: async () => {
            const data = await getDashboardStats();
            return data;
        }
    });

    console.log("usedata", query.data);

    return {
        data: query.data,
        isLoading: query.isLoading,
        error: query.error,
    };
}
