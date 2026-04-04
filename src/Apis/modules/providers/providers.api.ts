import { apiRequest } from "../../client/ApiAgents";
import { API_CONFIG } from "../../../Constants/apiConfig";
import type { FileUploadResponse, ProviderListData } from "./providers.types";

export function ImageUpload(
    payload: FormData,
    purpose?: string
) {
    if (purpose) {
        payload.append("purpose", purpose);
    }

    return apiRequest<FileUploadResponse>({
        url: "file-upload",
        method: "post",
        data: payload,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

// Provider List API
export async function getProviderList(
    organizationId?: string,
    medicalStoreId?: string,
    filters?: {
        search?: string;
        purpose?: string;
        pageNumber?: number;
        pageSize?: number;
    }
): Promise<ProviderListData> {
    const orgId = organizationId ?? API_CONFIG.organizationId;
    const storeId = medicalStoreId ?? API_CONFIG.medicalStoreId;

    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    if (filters?.purpose) params.append("purpose", filters.purpose);
    if (filters?.pageNumber) params.append("pageNumber", String(filters.pageNumber));
    if (filters?.pageSize) params.append("pageSize", String(filters.pageSize));

    const url = `organizations/${orgId}/medical-store/${storeId}/doctors${params.toString() ? `?${params}` : ""
        }`;

    const response = await apiRequest<ProviderListData>({
        url: url,
        method: "get",
    });
    console.log("Provider List Response:", response);

    return response.data
}
