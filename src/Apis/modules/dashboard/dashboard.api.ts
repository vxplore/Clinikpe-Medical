import { apiRequest } from "../../client/ApiAgents";
import { API_CONFIG } from "../../../Constants/apiConfig";
import type { DashboardData } from "./dashboard.types";

export async function getDashboardStats(
  organizationId?: string,
  medicalStoreId?: string
): Promise<DashboardData> {
  const orgId = organizationId ?? API_CONFIG.organizationId;
  const storeId = medicalStoreId ?? API_CONFIG.medicalStoreId;

  const response = await apiRequest<DashboardData>({
    url: `organizations/${orgId}/medical-store/${storeId}/dashboard`,
    method: "get",
  });

  return response.data;
}
