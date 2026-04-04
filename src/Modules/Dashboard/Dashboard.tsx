import { useState } from "react";
import DashboardStats from "./components/DashboardStats";
import FilterChips from "./components/ScrollableChips";
import AppointmentCard from "./components/AppointmentCard";
import { useDashboardStats } from "./hooks/useDashboardStats";
import { useProviderList } from "../Providers/hooks/useProviderList";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [activePurpose, setActivePurpose] = useState("all");
  const { data: dashboardStats, isLoading: isDashboardLoading, error: dashboardError } = useDashboardStats();
  const { providers, isLoading: isProvidersLoading, error: providersError } = useProviderList({
    purpose: "dropdown"
  });
  console.log("Dashboard Stats:", isProvidersLoading, providersError);
  console.log("Dashboard Stats:", dashboardStats);
  const navigate = useNavigate();

  console.log("Dashboard Stats:", dashboardStats);
  console.log("Providers:", providers);

  const doctorOptions = [
    { label: "All", value: "all" },
    { label: "Mohan", value: "mohan" },
    { label: "dr biswajeet", value: "dr-biswajeet" },
    { label: "dr Rohan ", value: "dr rohan" },
    { label: "dr Treatment", value: "treatment" },
  ];

  const appointments = [
    {
      id: "1",
      patientName: "Aji Rahaman",
      age: 23,
      gender: "Male",
      date: "31 Dec",
      time: "2:00 PM",
      type: "Follow-up",
      status: "Upcoming" as const,
      paymentStatus: "Payment: Pending",
      phoneNumber: "+1234567890",
    },
    {
      id: "2",
      patientName: "Sarah Ahmed",
      age: 28,
      gender: "Female",
      date: "02 Jan",
      time: "3:30 PM",
      type: "Consultation",
      status: "Upcoming" as const,
      paymentStatus: "Payment: Completed",
      phoneNumber: "+1234567891",
    },
    {
      id: "3",
      patientName: "John Smith",
      age: 35,
      gender: "Male",
      date: "05 Jan",
      time: "10:00 AM",
      type: "Check-up",
      status: "Upcoming" as const,
      paymentStatus: "Payment: Pending",
      phoneNumber: "+1234567892",
    },
  ];

  const handleCancel = (id: string) => {
    console.log("Cancel appointment:", id);
  };

  const handleMarkComplete = (id: string) => {
    console.log("Mark complete:", id);
  };

  return (
    <div className="w-full space-y-2">
      <DashboardStats stats={dashboardStats} isLoading={isDashboardLoading} />

      {dashboardError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Failed to load dashboard stats.
        </div>
      )}

      

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Recent Appointments</h3>
          <button onClick={() => navigate("/appointments")} className="text-sm text-blue-600 hover:text-blue-800">
            see all
          </button>
        </div>
      </div>
      <FilterChips
          filters={doctorOptions}
          activeTab={activePurpose}
          onCategoryChange={setActivePurpose}
        />

      {/* Appointment Cards Stack */}
      <div className="space-y-4">
        {appointments.map((appointment) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            onCancel={handleCancel}
            onMarkComplete={handleMarkComplete}
          />
        ))}
      </div>
      
    </div>
  );
};

export default Dashboard;
