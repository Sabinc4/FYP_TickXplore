import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { refundsApi, type RefundRequest, type BookingRef, type User } from "../../api";

interface OutletContext {
  refundRequests: RefundRequest[];
  fetchData: () => void;
}

const Refunds = () => {
  const { refundRequests = [], fetchData } = useOutletContext<OutletContext>();

  const handleRefundAction = async (id: string, action: "approve" | "reject") => {
    try {
      await refundsApi.adminAction(id, action);
      toast.success(`Refund ${action}d successfully`);
      fetchData();
    } catch (error) {
      const axiosErr = error as { response?: { data?: { message?: string } } };
      toast.error(axiosErr.response?.data?.message || `Failed to ${action} refund`);
    }
  };

  const booking = (req: RefundRequest) => req.bookingId as BookingRef | undefined;
  const user = (req: RefundRequest) => req.userId as User | undefined;

  return (
    <div className="rounded-lg bg-white p-6 shadow-card">
      <h2 className="mb-4 text-2xl font-bold text-gray-800">Refund Requests</h2>
      {refundRequests.length === 0 ? (
        <p className="text-gray-500">No pending refund requests.</p>
      ) : (
        <div className="space-y-4">
          {refundRequests.map((req) => (
            <div key={req._id} className="rounded bg-gray-50 p-4 shadow-sm border">
              <p className="break-all">
                <strong>Booking ID:</strong> {booking(req)?._id}
              </p>
              <p className="break-all">
                <strong>User:</strong> {user(req)?.email}
              </p>
              <p>
                <strong>Amount:</strong> NPR {req.refundAmount ?? 0}
              </p>
              <p>
                <strong>Reason:</strong> {req.reason}
              </p>
              <p>
                <strong>Status:</strong> {req.status}
              </p>

              <div className="mt-3 flex space-x-2">
                <button
                  onClick={() => handleRefundAction(req._id, "approve")}
                  className="rounded bg-green-600 px-3 py-1 text-white transition hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleRefundAction(req._id, "reject")}
                  className="rounded bg-red-600 px-3 py-1 text-white transition hover:bg-red-700"
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