import DataTable from "../../Component/Admin Component/Admin_DataTable";
import AdminPageHeader from "../../Component/Admin Component/AdminPageHeader";
import { useOutletContext } from "react-router-dom";
import type { User } from "../../api";

interface OutletContext {
  users: User[];
  loading: boolean;
  error: string;
  handleDeleteUser: (id: string) => void;
}

const Users = () => {
  const { users, handleDeleteUser, loading, error } = useOutletContext<OutletContext>();

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error loading users: {error}</div>;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Users"
        subtitle="All registered users of TickXplore."
      />
      <DataTable<User>
        title="Users"
        data={users}
        fields={["name", "email"]}
        headers={["Name", "Email"]}
        onDelete={handleDeleteUser}
        hideTitle
      />
    </div>
  );
};

export default Users;