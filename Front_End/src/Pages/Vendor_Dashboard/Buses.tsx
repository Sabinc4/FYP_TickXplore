import { useState } from "react";
import { toast } from "react-toastify";
import { useOutletContext } from "react-router-dom";
import TransportSection from "../../Component/Vendor Component/Vendor_TransportSection";
import AddEditForm from "../../Component/Vendor Component/Vendor_AddEditForm";
import AdminPageHeader from "../../Component/Admin Component/AdminPageHeader";
import { busesApi, type Bus, type Vehicle } from "../../api";

interface OutletContext {
  buses: Bus[];
  fetchData: () => void;
}

const Buses = () => {
  const { buses, fetchData } = useOutletContext<OutletContext>();
  const [editMode, setEditMode] = useState(false);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const addBus = (payload: FormData) => busesApi.create(payload);
  const updateBus = (id: string, payload: FormData) => busesApi.update(id, payload);
  const deleteBus = (id: string) => busesApi.remove(id);

  const handleAddNew = () => {
    setIsAdding(true);
    setEditMode(true);
    setSelectedBus(null);
  };

  const handleEditBus = (bus: Bus | Vehicle) => {
    setIsAdding(false);
    setEditMode(true);
    setSelectedBus(bus as Bus);
  };

  const handleDeleteBus = async (busId: string) => {
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
      <AdminPageHeader
        title="Buses"
        subtitle="Manage your buses, routes and schedule."
      >
        <button
          onClick={handleAddNew}
          className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm transition-colors hover:bg-indigo-50"
        >
          + Add New
        </button>
      </AdminPageHeader>

      <TransportSection
        title="Buses"
        items={buses}
        type="bus"
        onEdit={handleEditBus}
        onDelete={handleDeleteBus}
        onAddNew={handleAddNew}
        showHeader={false}
      />

      {(editMode || isAdding) && (
        <AddEditForm
          bus={selectedBus ?? undefined}
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