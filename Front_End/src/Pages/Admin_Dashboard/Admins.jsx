import React from 'react';
import DataTable from '../../Component/Admin_DataTable';
import { useOutletContext } from 'react-router-dom';

const Admins = () => {
  const { admins, loading, error } = useOutletContext();

  if (loading) return <div>Loading admins...</div>;
  if (error) return <div>Error loading admins: {error}</div>;

  return (
    <DataTable
      title="Admins"
      data={admins}
      fields={["name", "email"]}
      headers={["Name", "Email"]}
      renderCell={(item, field) => item[field]}
      disableEdit={true}
    />
  );
};

export default Admins;