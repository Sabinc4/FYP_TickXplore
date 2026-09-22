import DataTable from "../../Component/Admin_DataTable";
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
    <DataTable<User>
      title="Users"
      data={users}
      fields={["name", "email"]}
      headers={["Name", "Email"]}
      onDelete={handleDeleteUser}
      disableEdit
    />
  );
};

export default Users;