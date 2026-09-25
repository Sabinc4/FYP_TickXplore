import { useState } from "react";
import BusCards from "../../Component/Admin Component/Admin_BusCards";
import AdminPageHeader from "../../Component/Admin Component/AdminPageHeader";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { busesApi, type Bus } from "../../api";

interface OutletContext {
  buses: Bus[];
  loading: boolean;
  error: string;
  fetchData: () => void;
}

const Admin_Buses = () => {
  const { buses, loading, error, fetchData } = useOutletContext<OutletContext>();
  const [searchQuery, setSearchQuery] = useState("");
  const [busToRemove, setBusToRemove] = useState<Bus | null>(null);
  const [removing, setRemoving] = useState(false);

  const filteredBuses = buses.filter(
    (bus) =>
      bus.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bus.pickupPoint?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bus.dropPoint?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRemove = async (busId: string) => {
    setRemoving(true);
    try {
      await busesApi.remove(busId);
      toast.success("Bus removed successfully!");
      fetchData();
    } catch (error) {
      toast.error("Failed to remove bus.");
    } finally {
      setRemoving(false);
      setBusToRemove(null);
    }
  };

  if (loading) return <div>Loading buses...</div>;
  if (error) return <div>Error loading buses: {error}</div>;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Buses"
        subtitle="Manage bus listings across TickXplore."
      />
      <input
        type="text"
        placeholder="Search buses..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full rounded-xl border border-gray-300 p-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
      />
      <BusCards
        buses={filteredBuses}
        loading={loading}
        onRemove={(bus) => setBusToRemove(bus)}
      />

      {busToRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-card-lg">
            <h2 className="mb-4 text-xl font-bold text-gray-800">Confirm Removal</h2>
            <p className="mb-6 text-gray-500">
              Are you sure you want to remove this bus? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setBusToRemove(null)}
                className="rounded-xl bg-gray-200 px-4 py-2 text-gray-700 transition hover:bg-gray-300"
              >
                No
              </button>
              <button
                onClick={() => handleRemove(busToRemove._id!)}
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

export default Admin_Buses;