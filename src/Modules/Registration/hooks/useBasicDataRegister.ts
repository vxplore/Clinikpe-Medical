import { useMutation } from "@tanstack/react-query";
import { basicDetailsRegister } from "../../../Apis/modules/auth/BasicDetails/BasicDetails.api";
import { queryClient } from "../../../Apis/client/queryClient";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../../app/provider/toaster.config";
/**
 * Hook to register medical store with basic details.
 *
 * Returns mutation object for triggering store registration.
 * Automatically invalidates related queries on success.
 *
 * @returns Mutation object with trigger and state
 *
 * @example
 * ```typescript
 * const { mutate, isPending, error, data } = useBasicDataRegister();
 *
 * const handleSubmit = () => {
 *   mutate({
 *     store_name: formData.storeName,
 *     manager_name: formData.ownerName,
 *     phone_number: formData.phoneNumber,
 *     address: formData.address,
 *     lat: formData.lat,
 *     lng: formData.lng
 *   });
 * };
 * ```
 */
export const useBasicDataRegister = () => {
  const navigate  = useNavigate();
    const { mutate, isPending, error, data } = useMutation({
        mutationFn: basicDetailsRegister,
        onSuccess: () => {
            // Invalidate registration related queries
            queryClient.invalidateQueries({ queryKey: ["registration"] });
            queryClient.invalidateQueries({ queryKey: ["storeDetails"] });
            navigate("/dashboard" , {replace: true})
            showToast.success("Registration successful!")

        },
        onError: (err) => {
            console.error("Store registration failed:", err);
            showToast.error("Failed to register store. Please try again.")
        },
    });

    return {
        mutate,
        isPending,
        error,
        data: data?.data,
    };
};


