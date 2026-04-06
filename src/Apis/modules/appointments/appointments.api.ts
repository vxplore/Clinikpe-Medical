import { apiRequest } from "../../client/ApiAgents";
import { API_CONFIG } from "../../../Constants/apiConfig";
import type { AppointmentListData } from "./appointments.types";

export async function getAppointmentList(filters?: {
    from_date?: string;
    to_date?: string;
    pageNumber?: number;
    pageSize?: number;
}): Promise<AppointmentListData> {
    console.log("API call to fetch appointments with filters:", filters);

    const orgId = API_CONFIG.organizationId;
    const storeId = API_CONFIG.medicalStoreId;

    const response = await apiRequest<AppointmentListData>({
        url: `organizations/${orgId}/medical-store/${storeId}/doctors/all/appointments`,
        method: "get",
        params: {
            from_date: filters?.from_date,
            to_date: filters?.to_date,
            pageNumber: filters?.pageNumber,
            pageSize: filters?.pageSize,
        },
    });

    return response.data;
}



export async function ChnageAppointmentStatus(appointmentId: string, activity: string) {
    const org_Id = API_CONFIG.organizationId;
    const store_Id = API_CONFIG.medicalStoreId;
    const response = await apiRequest({
        url: `organizations/${org_Id}/medical-store/${store_Id}/doctors/all/appointments/${appointmentId}/action`,
        method: "post",
        data: {
            activity :activity
        }
    });

    return response.data;


}