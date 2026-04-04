import { apiRequest } from "../../../client/ApiAgents";
import type {
    BasicDetailsRegisterPayload,
    BasicDetailsRegisterResponse,
} from "./BasicDetails.types";



export function basicDetailsRegister(payload: BasicDetailsRegisterPayload) {
    return apiRequest<BasicDetailsRegisterResponse>({
        method: "post",
        url: "/organizations/medical-store/register",
        data: payload,
    });
}