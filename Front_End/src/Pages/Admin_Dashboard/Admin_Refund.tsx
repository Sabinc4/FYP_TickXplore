import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { FiRefreshCw } from "react-icons/fi";
import AdminPageHeader from "../../Component/AdminPageHeader";
import { refundsApi, type RefundRequest, type BookingRef, type User } from "../../api";

interface OutletContext {
  refundRequests: RefundRequest[];
  fetchData: () => void;
}

const statusChip = (status: string) =>
  (status || "").toLowerCase().includes("approve")
    ? "bg-emerald-100 text-emerald-700"
    : (status || "").toLowerCase().includes("reject")
    ? "bg-rose-100 text-rose-700"
    : "bg-amber-100 text-amber-700";

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
    <div className="space-y-6">
      <AdminPageHeader
        title="Refund Requests"
        subtitle="Approve or reject user refund requests."
      >
        <span className="rounded-full bg-white px-4 py-1.5 text-sm font-medium text-indigo-700 shadow-sm">
          {refundRequests.length} pending
        </span>
      </AdminPageHeader>

      {refundRequests.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-card">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <FiRefreshCw size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">No refund requests</h3>
          <p className="mt-1 text-sm text-gray-500">
            When users request a refund, it will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {refundRequests.map((req) => (
            <div
              key={req._id}
              className="rounded-2xl bg-white p-5 shadow-card transition-shadow hover:shadow-card-lg"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="break-all text-sm text-gray-500">
                  Booking:
                  <span className="ml-1 font-mono font-semibold text-slate-700">
                    {booking(req)?._id}
                  </span>
                </p>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusChip(req.status || "")}`}>
                  {req.status}
                </span>
              </div>
              <p className="mt-2 break-all text-sm text-gray-600">
                User: <span className="font-medium text-slate-700">{user(req)?.email}</span>
              </p>
              <p className="mt-3 text-lg font-bold text-indigo-700">
                NPR {req.refundAmount ?? 0}
              </p>
              <p className="mt-2 text-sm text-gray-600">
                <span className="font-semibold text-gray-700">Reason:</span> {req.reason}
              </p>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => handleRefundAction(req._id, "approve")}
                  className="flex-1 rounded-xl bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleRefundAction(req._id, "reject")}
                  className="flex-1 rounded-xl bg-rose-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-rose-700"
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