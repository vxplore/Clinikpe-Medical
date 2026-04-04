import React from "react";
import { Download, Printer } from "lucide-react";
import { colors } from "../../Constants/colors";
import { useQrCode } from "./hooks/useQrCode";

const QRCodePage: React.FC = () => {
  const { data: qrData, isLoading, error } = useQrCode();
  console.log("useQrCode - QR Code Data Error:", error);
  console.log("QR Code Data:", qrData);

  const handleDownload = async () => {
    // Ensure we have a URL (using qr_image_url if 'download' isn't explicitly set)
    const downloadUrl = qrData?.download || qrData?.qr_image_url;
    if (!downloadUrl) return;

    try {
      
      const response = await fetch(downloadUrl, {
        method: "GET",
        mode: "cors" 
      });

      if (!response.ok) {
        throw new Error("Failed to fetch QR");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${qrData?.center_name?.replace(/[^a-z0-9]/gi, "_") || "Center"}_QR.png`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("QR download failed (likely CORS). Falling back to new tab:", err);
      window.open(downloadUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handlePrint = () => {
    if (!qrData?.qr_image_url) {
      console.error("QR Code image not available");
      return;
    }

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(
        `<html><head><title>Print QR Code</title></head><body style="text-align:center; margin: 20px;"><h1>${qrData.center_name}</h1><img src="${qrData.qr_image_url}" alt="QR Code" style="width: 400px; height: 400px;"/><p>${qrData.booking_url}</p></body></html>`,
      );
      printWindow.document.close();
      printWindow.print();
      console.log("Print dialog opened");
    }
  };

  return (
    <div className="w-full px-0">
      {isLoading && (
        <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
          <p className="text-gray-600">Loading QR Code...</p>
        </div>
      )}

      {error && (
        <div className="bg-white rounded-2xl border border-red-200 bg-red-50 p-4 text-center">
          <p className="text-red-700">Failed to load QR Code</p>
        </div>
      )}

      {qrData && !isLoading && (
        <>
          {/* QR Code Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-6 mt-0">
            {/* Store Info */}
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {qrData.center_name}
              </h1>
            </div>

            {/* QR Code Display */}
            <div className="flex justify-center bg-gray-50 rounded-lg p-4">
              <img
                className="w-64 h-64 object-contain"
                src={qrData.qr_image_url}
                alt={`${qrData.center_name} QR Code`}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 mt-4">
            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="w-full py-3 px-4 rounded-full font-semibold text-white flex items-center justify-center gap-2 transition hover:opacity-90 cursor-pointer"
              style={{ backgroundColor: colors.primary }}
            >
              <Download size={20} />
              Download QR Code
            </button>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="w-full py-3 px-4 rounded-full font-semibold flex items-center justify-center gap-2 transition border-2 cursor-pointer"
              style={{
                borderColor: colors.primary,
                color: colors.primary,
              }}
            >
              <Printer size={20} />
              Print QR Code
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default QRCodePage;