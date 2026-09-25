import { useState } from "react";
import VehicleCards from "../../Component/Admin Component/Admin_VehicleCards";
import AdminPageHeader from "../../Component/Admin Component/AdminPageHeader";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { vehiclesApi, type Vehicle } from "../../api";

interface OutletContext {
  vehicles: Vehicle[];
  loading: boolean;
  error: string;
  fetchData: () => void;
}

const Admin_Vehicles = () => {
  const { vehicles, loading, error, fetchData } = useOutletContext<OutletContext>();
  const [searchQuery, setSearchQuery] = useState("");
  const [vehicleToRemove, setVehicleToRemove] = useState<Vehicle | null>(null);
  const [removing, setRemoving] = useState(false);

  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.type?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRemove = async (vehicleId: string) => {
    setRemoving(true);
    try {
      await vehiclesApi.remove(vehicleId);
      toast.success("Vehicle removed successfully!");
      fetchData();
    } catch (error) {
      toast.error("Failed to remove vehicle.");
    } finally {
      setRemoving(false);
      setVehicleToRemove(null);
    }
  };

  if (loading) return <div>Loading vehicles...</div>;
  if (error) return <div>Error loading vehicles: {error}</div>;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Vehicles"
        subtitle="Manage vehicle listings across TickXplore."
      />
      <input
        type="text"
        placeholder="Search vehicles..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full rounded-xl border border-gray-300 p-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
      />
      <VehicleCards
        vehicles={filteredVehicles}
        loading={loading}
        onRemove={(vehicle) => setVehicleToRemove(vehicle)}
      />

      {vehicleToRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-card-lg">
            <h2 className="mb-4 text-xl font-bold text-gray-800">Confirm Removal</h2>
            <p className="mb-6 text-gray-500">
              Are you sure you want to remove this vehicle? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setVehicleToRemove(null)}
                className="rounded-xl bg-gray-200 px-4 py-2 text-gray-700 transition hover:bg-gray-300"
              >
                No
              </button>
              <button
                onClick={() => handleRemove(vehicleToRemove._id!)}
                disabled={removing}
                className="rounded-xl bg-rose-600 px-4 py-2 text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {removing ? "Removing..." : "Yes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin_Vehicles;