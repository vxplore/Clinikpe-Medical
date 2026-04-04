import { useQuery } from "@tanstack/react-query";
import { getQRCode } from "../../../Apis/modules/QrCode/QrCode.api";

export const useQrCode = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["qrCode"],
        queryFn: async () => {
            const response = await getQRCode();
            console.log("getQRCode response:", response);
            return response;
        },
        select: (data) => data,
    });

    console.log("useQrCode - data:", data);

    return {
        data,
        isLoading,
        error,
    };
};
