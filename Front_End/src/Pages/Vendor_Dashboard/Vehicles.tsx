import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useOutletContext } from "react-router-dom";
import TransportSection, { type Reservation } from "../../Component/Vendor Component/Vendor_TransportSection";
import AddEditForm from "../../Component/Vendor Component/Vendor_AddEditForm";
import ConfirmDialog from "../../Component/ConfirmDialog";
import AdminPageHeader from "../../Component/Admin Component/AdminPageHeader";
import { bookingsApi, vehiclesApi, type Bus, type Vehicle } from "../../api";

interface OutletContext {
  vehicles: Vehicle[];
  fetchData: () => void;
}

const Vehicles = () => {
  const { vehicles, fetchData } = useOutletContext<OutletContext>();
  const [editMode, setEditMode] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [pendingDelete, setPendingDelete] = useState<Vehicle | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const vendorId = localStorage.getItem("vendorId") || "";

  const addVehicle = (payload: FormData) => vehiclesApi.create(payload);
  const updateVehicle = (id: string, payload: FormData) => vehiclesApi.update(id, payload);
  const deleteVehicle = (id: string) => vehiclesApi.remove(id);

  const fetchReservations = useCallback(async () => {
    if (!vendorId) return;
    try {
      const res = await bookingsApi.getReservationsByVendor(vendorId);
      const raw = res as { reservations?: Reservation[] } | Reservation[];
      setReservations(Array.isArray(raw) ? raw : raw.reservations || []);
    } catch (error) {
      console.error("Failed to fetch reservations");
      toast.error("Failed to load reservations.");
    }
  }, [vendorId]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const handleAddNew = () => {
    setIsAdding(true);
    setEditMode(true);
    setSelectedVehicle(null);
  };

  const handleEditVehicle = (vehicle: Bus | Vehicle) => {
    setIsAdding(false);
    setEditMode(true);
    setSelectedVehicle(vehicle as Vehicle);
  };

  const handleDeleteVehicle = async () => {
    const vehicleId = pendingDelete?._id;
    if (!vehicleId) return;
    setDeletingId(vehicleId);
    try {
      await deleteVehicle(vehicleId);
      toast.success("Vehicle deleted successfully!");
      fetchData();
      fetchReservations();
    } catch (error) {
      toast.error("Error deleting vehicle.");
    } finally {
      setDeletingId(null);
      setPendingDelete(null);
    }
  };

  return (
    <>
      <AdminPageHeader
        title="Vehicles"
        subtitle="Manage your vehicles, pricing and availability."
      >
        <button
          onClick={handleAddNew}
          className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm transition-colors hover:bg-indigo-50"
        >
          + Add New
        </button>
      </AdminPageHeader>

      <TransportSection
        title="Vehicles"
        items={vehicles}
        type="vehicle"
        onEdit={handleEditVehicle}
        onDelete={(id) =>
          setPendingDelete(vehicles.find((v) => v._id === id) ?? null)
        }
        onAddNew={handleAddNew}
        reservations={reservations}
        showHeader={false}
      />

      {(editMode || isAdding) && (
        <AddEditForm
          vehicle={selectedVehicle ?? undefined}
          isAdding={isAdding}
          type="vehicles"
          onClose={() => {
            setEditMode(false);
            setIsAdding(false);
          }}
          onFetchData={() => {
            fetchData();
            fetchReservations();
          }}
          addVehicle={addVehicle}
          updateVehicle={updateVehicle}
        />
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete vehicle"
        message={`Are you sure you want to delete "${pendingDelete?.name || "this vehicle"}"? This cannot be undone.`}
        confirmLabel="Delete"
        tone="danger"
        busy={deletingId !== null}
        onConfirm={handleDeleteVehicle}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  );
};

export default Vehicles;