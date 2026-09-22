import { useState } from "react";
import { toast } from "react-toastify";
import { bookingsApi } from "../api";

interface RefundRequestModalProps {
  bookingId: string;
  onClose: () => void;
}

const RefundRequestModal = ({ bookingId, onClose }: RefundRequestModalProps) => {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bookingId) {
      toast.error("Booking ID is missing!");
      return;
    }

    if (!reason.trim()) {
      toast.error("Please provide a reason for your refund.");
      return;
    }

    try {
      setLoading(true);
      await bookingsApi.refundRequest(bookingId, { refundReason: reason });

      toast.success("Refund request submitted successfully!");
      onClose();
    } catch (err) {
      console.error("Refund error:", err);
      toast.error("Failed to submit refund request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-card-lg">
        <h2 className="mb-4 text-xl font-semibold text-slate-900">Request Refund</h2>
        <textarea
          className="mb-4 h-32 w-full resize-none rounded-xl border border-slate-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={5}
          placeholder="Explain your reason for requesting a refund..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-200 px-4 py-2 text-slate-700 transition hover:bg-slate-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !reason.trim()}
            className="rounded-xl bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RefundRequestModal;