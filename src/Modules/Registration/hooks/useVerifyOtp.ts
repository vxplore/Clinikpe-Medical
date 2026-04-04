import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import type { VerifyOtpPayload, VerifyOtpData } from "../../../Apis/modules/auth/VerifyOtp/VerifyOtp.types";
import type { ApiSuccess, ApiFailure } from "../../../Apis/client/ApiAgents.types";
import { VerifyOtp } from "../../../Apis/modules/auth/VerifyOtp/VerifyOtp.api";
import { showToast } from "../../../app/provider/toaster.config";
import { useRegistrationStore } from "../../../stores/registrationStore";

export function useVerifyOtp() {
    const navigate = useNavigate();
    const setPhoneNumber = useRegistrationStore((state) => state.setPhoneNumber);
    const pendingPhoneRef = useRef("");

    const mutation = useMutation<ApiSuccess<VerifyOtpData>, ApiFailure, VerifyOtpPayload>({
        mutationFn: (payload: VerifyOtpPayload) => {
            pendingPhoneRef.current = payload.emailMobile?.replace(/^91/, "") || "";
            console.log("OTP Verify Payload:", payload);
            return VerifyOtp(payload);
        },
        onSuccess: (response: ApiSuccess<VerifyOtpData>) => {
            console.log("OTP Verify Success:", response);
            showToast.success("OTP verified successfully!");
            if (response.data.is_register) {
                setTimeout(() => {
                    navigate("/dashboard", { replace: true });
                }, 500);
            }
            else {
                if (pendingPhoneRef.current) {
                    setPhoneNumber(pendingPhoneRef.current);
                }
                setTimeout(() => {
                    navigate("/basic-details", { replace: true });
                }, 500);
            }

        },
        onError: (apiError: ApiFailure) => {
            console.error("OTP Verify Error:", apiError);
            const errorMessage = apiError?.message || "Failed to verify OTP. Please try again.";
            showToast.error(errorMessage);
        },
        retry: false,
    });

    return {
        mutate: mutation.mutate,
        isLoading: mutation.isPending,
        error: mutation.error?.message || null,
        data: mutation.data?.data || null,
    };
}
