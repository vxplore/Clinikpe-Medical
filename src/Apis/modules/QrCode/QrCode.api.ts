import { apiRequest } from "../../client/ApiAgents";
import { API_CONFIG } from "../../../Constants/apiConfig";
import type { QRCodeData, QRCodeResponse } from "./QrCode.types";

export async function getQRCode(
    organizationId?: string,
    medicalStoreId?: string
): Promise<QRCodeData> {
    const orgId = organizationId ?? API_CONFIG.organizationId;
    const storeId = medicalStoreId ?? API_CONFIG.medicalStoreId;

    const response = await apiRequest<QRCodeResponse>({
        url: `organizations/${orgId}/medical-store/${storeId}/qr-code`,
        method: "get",
    });
    console.log("QR Code API Response:", response);
    //@ts-expect-error - TypeScript is not correctly inferring the type of response.data
    return response.data.qr_code
}
