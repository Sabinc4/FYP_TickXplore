import React, { useState } from "react";
import { toast } from "react-toastify";
import FormInput from "../Component/Vendor_FormInput";

const AddEditForm = ({
  vehicle,
  bus,
  isAdding,
  type,
  onClose,
  onFetchData,
  addBus,
  updateBus,
  addVehicle,
  updateVehicle,
}) => {
  const [formData, setFormData] = useState({
    name: vehicle?.name || bus?.name || "",
    type: type === "vehicles" ? "Vehicle" : "Bus",
    pricePerSeat: bus?.pricePerSeat || "",
    price: vehicle?.price || "",
    capacity: vehicle?.capacity || "",
    image: "",
    pickupPoint: bus?.pickupPoint || "",
    dropPoint: bus?.dropPoint || "",
    totalSeats: bus?.totalSeats || "",
    isAvailable: vehicle?.isAvailable || true,
    takeOffDate: type === "buses" && bus?.takeOffDate
      ? new Date(bus.takeOffDate).toISOString().slice(0, 16)
      : "",
    tripDate: bus?.tripDate || "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const vendorId = localStorage.getItem("vendorId");
      if (!vendorId) {
        toast.error("Vendor ID is missing. Please log in again.");
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("vendorId", vendorId);
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "image" && value) formDataToSend.append(key, value);
      });

      // Validation
      if (type === "buses" && !formData.takeOffDate) {
        toast.error("Please select a take-off date and time for the bus");
        return;
      }

      if (formData.image instanceof File) {
        formDataToSend.append("image", formData.image);
      }

      let response;
      if (type === "vehicles") {
        response = isAdding
          ? await addVehicle(formDataToSend)
          : await updateVehicle(vehicle._id, formDataToSend);
      } else {
        response = isAdding
          ? await addBus(formDataToSend)
          : await updateBus(bus._id, formDataToSend);
      }

      if (response.data.success) {
        toast.success(`${type === "vehicles" ? "Vehicle" : "Bus"} ${isAdding ? "added" : "updated"} successfully!`);
        onFetchData();
        onClose();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.response?.data?.message || "Failed to submit form.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {isAdding ? `Add New ${type === "vehicles" ? "Vehicle" : "Bus"}` : `Edit ${type === "vehicles" ? "Vehicle" : "Bus"}`}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <FormInput
            label="Name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          {type === "vehicles" ? (
            <FormInput
              label="Price"
              type="number"
              name="price"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
          ) : (
            <FormInput
              label="Price per Seat"
              type="number"
              name="pricePerSeat"
              value={formData.pricePerSeat}
              onChange={(e) => setFormData({ ...formData, pricePerSeat: e.target.value })}
            />
          )}

          {type === "buses" && (
            <>
              <FormInput
                label="Pickup Point"
                name="pickupPoint"
                value={formData.pickupPoint}
                onChange={(e) => setFormData({ ...formData, pickupPoint: e.target.value })}
              />
              <FormInput
                label="Drop Point"
                name="dropPoint"
                value={formData.dropPoint}
                onChange={(e) => setFormData({ ...formData, dropPoint: e.target.value })}
              />
            </>
          )}

          {type === "buses" ? (
            <FormInput
              label="Total Seats"
              type="number"
              name="totalSeats"
              value={formData.totalSeats}
              onChange={(e) => setFormData({ ...formData, totalSeats: e.target.value })}
            />
          ) : (
            <FormInput
              label="Capacity"
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
            />
          )}

          {/* Only for Buses */}
          {type === "buses" && (
            <>
              <FormInput
                label="Take Off Date & Time"
                type="datetime-local"
                name="takeOffDate"
                value={formData.takeOffDate}
                onChange={(e) => setFormData({ ...formData, takeOffDate: e.target.value })}
              />
            </>
          )}

          <div className="col-span-2">
            <label className="text-sm font-medium text-gray-700">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div className="mt-2">
                <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
              </div>
            )}
          </div>

          <div className="col-span-2 flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {isSubmitting ? "Submitting..." : isAdding ? "Add" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditForm;
