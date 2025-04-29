import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
import TransportSection from "../../Component/Vendor_TransportSection";
import AddEditForm from "../../Component/Vendor_AddEditForm";

const Vehicles = () => {
  const { vehicles, fetchData } = useOutletContext();
  const [editMode, setEditMode] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [reservations, setReservations] = useState([]);

  const vendorId = localStorage.getItem("vendorId");
  const API_BASE_URL = "http://localhost:3001/api";

  const addVehicle = (formData) => axios.post(`${API_BASE_URL}/vehicles`, formData);
  const updateVehicle = (id, formData) => axios.put(`${API_BASE_URL}/vehicles/${id}`, formData);
  const deleteVehicle = (id) => axios.delete(`${API_BASE_URL}/vehicles/${id}`);

  const fetchReservations = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/reservations/vendor/${vendorId}`);
      setReservations(res.data.reservations || []);
    } catch (error) {
      console.error("Failed to fetch reservations");
    }
  };

  useEffect(() => {
    if (vendorId) {
      fetchReservations();
    }
  }, [vendorId]);

  const handleAddNew = () => {
    setIsAdding(true);
    setEditMode(true);
    setSelectedVehicle(null);
  };

  const handleEditVehicle = (vehicle) => {
    setIsAdding(false);
    setEditMode(true);
    setSelectedVehicle(vehicle);
  };

  const handleDeleteVehicle = async (vehicleId) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      try {
        await deleteVehicle(vehicleId);
        toast.success("Vehicle deleted successfully!");
        fetchData(); // Refresh vehicles
        fetchReservations(); // Refresh reservations
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
        reservations={reservations}  // ✅ Now available
      />

      {(editMode || isAdding) && (
        <AddEditForm
          vehicle={selectedVehicle}
          isAdding={isAdding}
          type="vehicles"
          onClose={() => {
            setEditMode(false);
            setIsAdding(false);
          }}
          onFetchData={() => {
            fetchData();
            fetchReservations(); // Refresh after add/edit
          }}
          addVehicle={addVehicle}
          updateVehicle={updateVehicle}
        />
      )}
    </>
  );
};

export default Vehicles;
