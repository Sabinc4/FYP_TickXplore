import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const RefundRequestModal = ({ bookingId, onClose }) => {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bookingId) {
      toast.error("Booking ID is missing!");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`/api/bookings/refund-request/${bookingId}`, {
        refundReason: reason,
      });

      toast.success("Refund request submitted successfully!");
      console.log("Refund success:", response.data);
      onClose(); // close the modal after success
    } catch (err) {
      console.error("Refund error:", err);
      toast.error("Failed to submit refund request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Request Refund</h2>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="5"
          placeholder="Explain your reason for requesting a refund..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RefundRequestModal;
