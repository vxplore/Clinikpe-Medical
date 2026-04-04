import { useState } from "react";
import { Search, Filter, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FilterChips from "../Dashboard/components/ScrollableChips";
import AppointmentCard from "../Dashboard/components/AppointmentCard";
import { useAppointmentList } from "./hooks/useAppointmentList";

const Appointments = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDoctor, setActiveDoctor] = useState("all");

  // Get current date range (last 30 days to 30 days in future)
  const today = new Date();
  const fromDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  const toDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const {
    appointments: appointmentList,
    isLoading,
    error,
  } = useAppointmentList({
    from_date: fromDate,
    to_date: toDate,
    pageNumber: 1,
    pageSize: 100,
  });

  console.log("Appointments:", appointmentList);

  const doctors = [
    { label: "All Doctors", value: "all" },
    ...(appointmentList?.map((apt) => ({
      label: apt.doctor_name,
      value: apt.doctor_id,
    })) || []),
  ];

  // Remove duplicates
  const uniqueDoctors = Array.from(
    new Map(doctors.map((item) => [item.value, item])).values(),
  );

  const filteredAppointments =
    appointmentList
      ?.filter((apt) => {
        const matchesSearch = apt.patient_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesDoctor =
          activeDoctor === "all" || apt.doctor_id === activeDoctor;
        return matchesSearch && matchesDoctor;
      })
      .map((apt) => ({
        id: apt.uid,
        patientName: apt.patient_name,
        age: 0, // Not available in API
        gender: "Unknown", // Not available in API
        date: new Date(apt.date).toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
        }),
        time: apt.time.slice(0, 5), // HH:mm format
        type: apt.appointment_type || "General",
        status: (apt.appointment_status === "create"
          ? "Upcoming"
          : "Completed") as "Upcoming" | "Completed",
        paymentStatus: "Payment: Pending",
        phoneNumber: "+1234567890", // Not available in API
      })) || [];

  const handleCancel = (id: string) => {
    console.log("Cancel appointment:", id);
  };

  const handleMarkComplete = (id: string) => {
    console.log("Mark complete:", id);
  };

  const handleAddAppointment = () => {
    navigate("/add-appointment");
  };

  return (
    <div className="w-full relative ">
      {/* Search Bar */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
          />
        </div>
        <button className="p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
          <Filter size={18} className="text-gray-600" />
        </button>
      </div>

      {/* Filter Chips */}
      <div className="mb-2">
        <FilterChips
          filters={uniqueDoctors}
          activeTab={activeDoctor}
          onCategoryChange={setActiveDoctor}
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-sm">Loading appointments...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-4">
          Failed to load appointments. Please try again.
        </div>
      )}

      {/* Appointment Cards */}
      <div className="space-y-4">
        {!isLoading && filteredAppointments.length > 0
          ? filteredAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onCancel={handleCancel}
                onMarkComplete={handleMarkComplete}
              />
            ))
          : !isLoading && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-sm">No appointments found</p>
              </div>
            )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={handleAddAppointment}
        className="fixed bottom-24 right-4 w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition z-40"
      >
        <Plus size={40} />
      </button>
    </div>
  );
};

export default Appointments;
