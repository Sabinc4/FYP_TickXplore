import DataTable from "../../Component/Admin_DataTable";
import AdminPageHeader from "../../Component/AdminPageHeader";
import { useOutletContext } from "react-router-dom";
import type { User } from "../../api";

interface OutletContext {
  admins: User[];
  loading: boolean;
  error: string;
  handleDeleteAdmin: (id: string) => void;
}

const currentAdminId = () => localStorage.getItem("adminId");

const Admin_Admins = () => {
  const { admins, handleDeleteAdmin, loading, error } =
    useOutletContext<OutletContext>();

  if (loading) return <div>Loading admins...</div>;
  if (error) return <div>Error loading admins: {error}</div>;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Admins"
        subtitle="Administrator accounts with full dashboard access."
      />
      <DataTable<User>
        title="Admins"
        data={admins}
        fields={["name", "email"]}
        headers={["Name", "Email"]}
        onDelete={handleDeleteAdmin}
        disableDelete={(admin) => admin._id === currentAdminId()}
        hideTitle
      />
    </div>
  );
};

export default Admin_Admins;