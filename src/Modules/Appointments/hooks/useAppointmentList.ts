import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChnageAppointmentStatus, getAppointmentList } from "../../../Apis/modules/appointments/appointments.api";
import type { Appointment, Pagination } from "../../../Apis/modules/appointments/appointments.types";

export interface UseAppointmentListFilters {
    from_date?: string;
    to_date?: string;
    pageNumber?: number;
    pageSize?: number;
}

export const useAppointmentList = (filters?: UseAppointmentListFilters) => {
    console.log("Fetching appointments with filters:", filters);
    const { data, isLoading, error } = useQuery({
        queryKey: ["appointments", filters?.from_date, filters?.to_date, filters?.pageNumber, filters?.pageSize],
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


export const useAppointmentStatusChange = () => {
     const queryClient = useQueryClient();
    const { mutateAsync, isPending, error } = useMutation({
        mutationFn: ({ appointmentId, activity }: { appointmentId: string; activity: string }) =>
            ChnageAppointmentStatus(appointmentId, activity),
         onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["appointments"],
            });
        },
    });


    return {
        changeStatus: mutateAsync,
        isLoading: isPending,
        error,
    }


}

export type { Appointment, Pagination };