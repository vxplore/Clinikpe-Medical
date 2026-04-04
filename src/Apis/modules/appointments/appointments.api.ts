import { apiRequest } from "../../client/ApiAgents";
import { API_CONFIG } from "../../../Constants/apiConfig";
import type { AppointmentListData } from "./appointments.types";

export async function getAppointmentList(
    organizationId?: string,
    medicalStoreId?: string,
    filters?: {
        from_date?: string;
        to_date?: string;
        pageNumber?: number;
        pageSize?: number;
    }
): Promise<AppointmentListData> {
    const orgId =  API_CONFIG.organizationId;
    const storeId = medicalStoreId ?? API_CONFIG.medicalStoreId;
    console.log("getAppointmentList - filters:", organizationId);
    const params = new URLSearchParams();
    // if (filters?.from_date) params.append("from_date", filters.from_date);
    // if (filters?.to_date) params.append("to_date", filters.to_date);
    if (filters?.pageNumber) params.append("pageNumber", String(filters.pageNumber));
    if (filters?.pageSize) params.append("pageSize", String(filters.pageSize));

    const url = `organizations/${orgId}/medical-store/${storeId}/doctors/all/appointments${params.toString() ? `?${params}` : ""
        }`;

    const response = await apiRequest<AppointmentListData>({
        url: url,
        method: "get",
    });
    console.log("Appointment List Response:", response);

    return response.data;
}