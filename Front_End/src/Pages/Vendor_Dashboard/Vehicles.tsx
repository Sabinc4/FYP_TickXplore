import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useOutletContext } from "react-router-dom";
import TransportSection, { type Reservation } from "../../Component/Vendor_TransportSection";
import AddEditForm from "../../Component/Vendor_AddEditForm";
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

  const handleDeleteVehicle = async (vehicleId: string) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      try {
        await deleteVehicle(vehicleId);
        toast.success("Vehicle deleted successfully!");
        fetchData();
        fetchReservations();
      } catch (error) {
        toast.error("Error deleting vehicle.");
      }
    }
  };

  return (
    <>
      <TransportSection
        title="Vehicles"
        items={vehicles}
        type="vehicle"
        onEdit={handleEditVehicle}
        onDelete={handleDeleteVehicle}
        onAddNew={handleAddNew}
        reservations={reservations}
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
    </>
  );
};

export default Vehicles;