import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./AppLayout";
import Login from "../Modules/Registration/Login";
import RegisterLayout from "./RegisterLayout";
import OtpVerifyPage from "../Modules/Registration/OtpVerify";
import BasicDetails from "../Modules/Registration/BasicDetails";
import MapLocation from "../Modules/Registration/MapLocation";
// import StoreDetails from "../Modules/Registration/StoreDetails";
import Dashboard from "../Modules/Dashboard/Dashboard";
import Appointments from "../Modules/Appointments/Appointments";
import AddAppointment from "../Modules/Appointments/AddAppointment";
import Providers from "../Modules/Providers/Providers";
import AddProvider from "../Modules/Providers/AddProvider";
import Profile from "../Modules/Profile/Profile";
import QRCodePage from "../Modules/QrCode/Qrcode";
import { API_KEY } from "../KEY";

const AppContents = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route element={<RegisterLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<OtpVerifyPage />} />
        <Route path="/basic-details" element={<BasicDetails />} />
        <Route
          path="/map-location"
          element={
            <MapLocation lat={0} lng={0} apiKey={API_KEY.GOOGLE_API_KEY} />
          }
        />

        {/* <Route path="/store-details" element={<StoreDetails />} /> */}
      </Route>

      <Route element={<AppLayout />}>
        {/* Other authenticated routes can go here */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/add-appointment" element={<AddAppointment />} />
        <Route path="/providers" element={<Providers />} />
        <Route path="/add-provider" element={<AddProvider />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/qr-code" element={<QRCodePage />} />
      </Route>
    </Routes>
  );
};

export default AppContents;
