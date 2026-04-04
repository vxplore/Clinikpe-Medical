export interface QRCodeData {
    center_name: string;
    center_image: string | null;
    center_icon: string | null;
    qr_image_url: string;
    booking_url: string;
    download: string;
}

export interface QRCodeResponse {
    success: boolean;
    httpStatus: number;
    message: string;
    data: {
        qr_code: QRCodeData;
    };
}
