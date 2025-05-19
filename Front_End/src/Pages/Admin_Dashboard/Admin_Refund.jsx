import React from 'react';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Refunds = () => {
  const { refundRequests = [], fetchData } = useOutletContext();

  const handleRefundAction = async (id, action) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3001/api/refunds/admin/refund-requests/${id}`,
        { action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Refund ${action}d successfully`);
      fetchData(); // Refresh data
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${action} refund`);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Refund Requests</h2>
      {refundRequests.length === 0 ? (
        <p className="text-gray-500">No pending refund requests.</p>
      ) : (
        <div className="space-y-4">
          {refundRequests.map((req) => (
            <div key={req._id} className="border p-4 rounded shadow-sm bg-gray-50">
              <p><strong>Booking ID:</strong> {req.bookingId?._id}</p>
              <p><strong>User:</strong> {req.userId?.email}</p>
              <p><strong>Amount:</strong> ₹{req.refundAmount}</p>
              <p><strong>Reason:</strong> {req.reason}</p>
              <p><strong>Status:</strong> {req.status}</p>

              <div className="mt-3 flex space-x-2">
                <button
                  onClick={() => handleRefundAction(req._id, "approve")}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleRefundAction(req._id, "reject")}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Refunds;
