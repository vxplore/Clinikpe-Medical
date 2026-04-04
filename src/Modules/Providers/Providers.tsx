import { useState } from "react";
import { Search, Filter, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProviderCard from "./components/ProviderCard";
import { useProviderList } from "./hooks/useProviderList";
import { colors } from "../../Constants/colors";

const Providers = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const {
    providers: providerList,
    isLoading,
    error,
  } = useProviderList({
    search: searchQuery,
    pageNumber: 1,
    pageSize: 100,
  });

  console.log("Providers:", providerList);

  const handleViewProfile = (id: string) => {
    console.log("View profile:", id);
  };

  const handleManageAvailability = (id: string) => {
    console.log("Manage availability:", id);
  };

  const handleToggleActive = (id: string, active: boolean) => {
    console.log("Toggle active:", id, active);
  };

  // Transform API provider data to ProviderCard format
  const transformedProviders =
    providerList?.map((provider) => ({
      id: provider.uid,
      name: provider.name,
      specialty: provider.specialities[0]?.name || "-",
      experience: `${provider.experience_of_number}+ Years Experience`,
      image: provider.profile_pic,
      availableDays: provider.available_minutes[0]?.days || [],
      startTime: provider.available_minutes[0]?.start_time || "N/A",
      endTime: provider.available_minutes[0]?.end_time || "N/A",
      location: "Medical Store",
      videoCallAvailable: true,
      isActive: provider.status === "active",
    })) || [];

  return (
    <div className="w-full relative ">
      {/* Search Bar */}
      <div className="flex gap-2 mb-6">
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
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
          />
        </div>
        <button className="p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
          <Filter size={18} className="text-gray-600" />
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-sm">Loading providers...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-4">
          Failed to load providers. Please try again.
        </div>
      )}

      {/* Provider Cards */}
      <div className="space-y-4">
        {!isLoading && transformedProviders.length > 0
          ? transformedProviders.map((provider) => (
              <ProviderCard
                key={provider.id}
                provider={provider}
                onViewProfile={handleViewProfile}
                onManageAvailability={handleManageAvailability}
                onToggleActive={handleToggleActive}
              />
            ))
          : !isLoading && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-sm">No providers found</p>
              </div>
            )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => navigate("/add-provider")}
        className="fixed bottom-24 right-4 w-12 h-12 text-white rounded-full flex items-center justify-center shadow-lg hover:opacity-90 transition z-40"
        style={{ backgroundColor: colors.primary }}
      >
        <Plus size={24} />
      </button>
    </div>
  );
};

export default Providers;
