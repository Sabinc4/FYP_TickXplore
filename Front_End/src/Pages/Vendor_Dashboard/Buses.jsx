import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
import TransportSection from "../../Component/Vendor_TransportSection";
import AddEditForm from "../../Component/Vendor_AddEditForm";

const Buses = () => {
  const { buses, fetchData } = useOutletContext();
  const [editMode, setEditMode] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const vendorId = localStorage.getItem("vendorId");
  const API_BASE_URL = "http://localhost:3001/api";

  const addBus = (formData) => axios.post(`${API_BASE_URL}/buses`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  const updateBus = (id, formData) => axios.put(`${API_BASE_URL}/buses/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  const deleteBus = (id) => axios.delete(`${API_BASE_URL}/buses/${id}`);

  const handleAddNew = () => {
    setIsAdding(true);
    setEditMode(true);
    setSelectedBus(null);
  };

  const handleEditBus = (bus) => {
    setIsAdding(false);
    setEditMode(true);
    setSelectedBus(bus);
  };

  const handleDeleteBus = async (busId) => {
    if (window.confirm("Are you sure you want to delete this bus?")) {
      try {
        await deleteBus(busId);
        toast.success("Bus deleted successfully!");
        fetchData();
      } catch (error) {
        toast.error("Error deleting bus.");
      }
    }
  };

  return (
    <>
      <TransportSection
        title="Buses"
        items={buses}
        type="bus"
        onEdit={handleEditBus}
        onDelete={handleDeleteBus}
        onAddNew={handleAddNew}
      />

      {(editMode || isAdding) && (
        <AddEditForm
          bus={selectedBus}
          isAdding={isAdding}
          type="buses"
          onClose={() => {
            setEditMode(false);
            setIsAdding(false);
          }}
          onFetchData={fetchData}
          addBus={addBus}
          updateBus={updateBus}
        />
      )}
    </>
  );
};

export default Buses;