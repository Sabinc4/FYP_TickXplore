import { useOutletContext } from "react-router-dom";
import { FiUsers, FiMapPin, FiMail, FiPhone, FiClock } from "react-icons/fi";
import type { Vendor } from "../../api";
import { API_BASE_URL } from "../../api";
import AdminPageHeader from "../../Component/Admin Component/AdminPageHeader";

interface OutletContext {
  vendorApplications: Vendor[];
  loading: boolean;
  error: string;
  approveVendor: (id: string) => void;
  declineVendor: (id: string) => void;
}

const resolvePhoto = (photo?: string) =>
  photo ? (photo.startsWith("http") ? photo : `${API_BASE_URL}${photo}`) : "";

const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleDateString() : "Unknown";

const Admin_VendorApplications = () => {
  const { vendorApplications, approveVendor, declineVendor, loading, error } =
    useOutletContext<OutletContext>();

  if (loading) return <div>Loading vendor applications...</div>;
  if (error) return <div>Error loading vendor applications: {error}</div>;

  const pendingCount = vendorApplications.length;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Vendor Applications"
        subtitle="Users who applied to become vendors, awaiting your review."
      >
        <span className="rounded-full bg-white px-4 py-1.5 text-sm font-medium text-indigo-700 shadow-sm">
          {pendingCount} pending
        </span>
      </AdminPageHeader>

      {vendorApplications.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-card">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <FiUsers size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">No vendor applications</h3>
          <p className="mt-1 text-sm text-gray-500">
            When users apply to become vendors, their applications will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {vendorApplications.map((vendor) => (
            <div
              key={vendor._id}
              className="flex flex-col rounded-2xl bg-white p-5 shadow-card transition-shadow hover:shadow-card-lg"
            >
              <div className="mb-4 flex items-start gap-4">
                {vendor.profilePhoto ? (
                  <img
                    src={resolvePhoto(vendor.profilePhoto)}
                    alt={vendor.vendorName}
                    className="h-14 w-14 rounded-full border-2 border-slate-200 object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-200 text-slate-500">
                    <FiUsers size={22} />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-lg font-semibold text-gray-900">
                    {vendor.vendorName || vendor.name || "Vendor"}
                  </h3>
                  <span className="mt-1 inline-block rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-medium text-emerald-700">
                    Pending
                  </span>
                </div>
              </div>

              <div className="mb-5 space-y-2 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <FiMail className="shrink-0 text-gray-400" />
                  <span className="truncate">{vendor.email}</span>
                </p>
                <p className="flex items-center gap-2">
                  <FiMapPin className="shrink-0 text-gray-400" />
                  <span className="truncate">{vendor.vendorLocation || "Not specified"}</span>
                </p>
                {vendor.phoneNumber && (
                  <p className="flex items-center gap-2">
                    <FiPhone className="shrink-0 text-gray-400" />
                    <span>{vendor.phoneNumber}</span>
                  </p>
                )}
                <p className="flex items-center gap-2">
                  <FiClock className="shrink-0 text-gray-400" />
                  <span>Applied {formatDate(vendor.createdAt)}</span>
                </p>
              </div>

              {vendor.applicationReason && (
                <div className="mb-5 rounded-xl border-l-4 border-indigo-400 bg-indigo-50 p-3 text-sm text-gray-700">
                  <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                    Reason
                  </p>
                  <p className="mt-1">&ldquo;{vendor.applicationReason}&rdquo;</p>
                </div>
              )}

              <div className="mt-auto flex gap-3">
                <button
                  onClick={() => approveVendor(vendor._id)}
                  className="flex-1 rounded-xl bg-emerald-600 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
                >
                  Accept
                </button>
                <button
                  onClick={() => declineVendor(vendor._id)}
                  className="flex-1 rounded-xl bg-rose-600 py-2 text-sm font-medium text-white transition hover:bg-rose-700"
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Admin_VendorApplications;