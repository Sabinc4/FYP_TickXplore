import React from 'react';
import DataTable from '../../Component/Admin_DataTable';
import { useOutletContext } from 'react-router-dom';

const Users = () => {
  const { users, handleEditClick, handleDeleteUser, loading, error } = useOutletContext();

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error loading users: {error}</div>;

  return (
    <DataTable
      title="Users"
      data={users}
      fields={["name", "email"]}
      headers={["Name", "Email"]}
      renderCell={(item, field) => item[field]}
      onEdit={(user) => handleEditClick(user, 'user')}
      onDelete={handleDeleteUser}
    />
  );
};

export default Users;