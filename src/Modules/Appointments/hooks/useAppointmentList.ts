import { useQuery } from "@tanstack/react-query";
import { getAppointmentList } from "../../../Apis/modules/appointments/appointments.api";
import type { Appointment, Pagination } from "../../../Apis/modules/appointments/appointments.types";

export interface UseAppointmentListFilters {
    from_date?: string;
    to_date?: string;
    pageNumber?: number;
    pageSize?: number;
}

export const useAppointmentList = (filters?: UseAppointmentListFilters) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["appointments", filters?.from_date, filters?.to_date, filters?.pageNumber, filters?.pageSize],
        //@ts-expect-error - The API function should be updated to accept filters
        queryFn: () => getAppointmentList(filters),
        select: (response) => ({
            appointments: response.appointments,
            pagination: response.pagination,
        }),
    });

    return {
        appointments: data?.appointments,
        pagination: data?.pagination,
        isLoading,
        error,
    };
};

export type { Appointment, Pagination };