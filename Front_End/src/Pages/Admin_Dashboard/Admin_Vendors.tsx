import DataTable from "../../Component/Admin_DataTable";
import { useOutletContext } from "react-router-dom";
import type { Vendor } from "../../api";

interface OutletContext {
  vendors: Vendor[];
  loading: boolean;
  error: string;
  handleDeleteVendor: (id: string) => void;
  toggleVendorStatus: (id: string) => void;
}

const Admin_Vendors = () => {
  const {
    vendors,
    handleDeleteVendor,
    toggleVendorStatus,
    loading,
    error,
  } = useOutletContext<OutletContext>();

  if (loading) return <div>Loading vendors...</div>;
  if (error) return <div>Error loading vendors: {error}</div>;

  return (
    <DataTable<Vendor>
      title="Vendors"
      data={vendors}
      fields={["vendorName", "email"]}
      headers={["Vendor Name", "Email"]}
      onDelete={handleDeleteVendor}
      onToggleStatus={toggleVendorStatus}
      disableEdit
    />
  );
};

export default Admin_Vendors;