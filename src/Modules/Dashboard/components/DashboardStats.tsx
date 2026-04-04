import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { DashboardData } from "../../../Apis/modules/dashboard/dashboard.types";

interface DashboardStatsProps {
  stats?: DashboardData;
  isLoading?: boolean;
}

const DashboardStats = ({ stats, isLoading }: DashboardStatsProps) => {
  const [period, setPeriod] = useState("This Month");
  const [isOpen, setIsOpen] = useState(false);

  const periods = ["This Month", "Last Month", "This Year"];

  return (
    <div className="w-full space-y-4">
      {/* Period Selector */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg flex items-center justify-between text-gray-600 hover:border-gray-400 transition"
        >
          <span>{period}</span>
          <ChevronDown size={20} />
        </button>
        {isOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 z-10">
            {periods.map((p) => (
              <button
                key={p}
                onClick={() => {
                  setPeriod(p);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 w-full">
        {/* All Providers Card */}
        <div className="bg-blue-100 rounded-2xl p-4 py-2 flex flex-col justify-center items-start">
          <p className="text-gray-600 text-sm mb-2">All Providers</p>
          <h2 className="text-4xl font-bold text-gray-900">
            {isLoading ? "..." : (stats?.all_providers ?? 0)}
          </h2>
        </div>

        {/* All Appointments Card */}
        <div className="bg-teal-100 rounded-2xl p-4 py-4 flex flex-col justify-center items-start">
          <p className="text-gray-600 text-sm mb-2">All Appointments</p>
          <h2 className="text-4xl font-bold text-gray-900">
            {isLoading ? "..." : (stats?.all_appointments ?? 0)}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
