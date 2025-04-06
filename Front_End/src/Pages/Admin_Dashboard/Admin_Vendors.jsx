import React from 'react';
import DataTable from '../../Component/Admin_DataTable';
import { useOutletContext } from 'react-router-dom';

const Admin_Vendors = () => {
  const { vendors, handleEditClick, handleDeleteVendor, toggleVendorStatus, loading, error } = useOutletContext();

  if (loading) return <div>Loading vendors...</div>;
  if (error) return <div>Error loading vendors: {error}</div>;

  return (
    <DataTable
      title="Vendors"
      data={vendors}
      fields={["vendorName", "email", "isActive"]}
      headers={["Vendor Name", "Email", "Status"]}
      renderCell={(item, field) => 
        field === "isActive" ? (item[field] ? "Active" : "Inactive") : item[field]
      }
      onEdit={(vendor) => handleEditClick(vendor, 'vendor')}
      onDelete={handleDeleteVendor}
      onToggleStatus={toggleVendorStatus}
    />
  );
};

export default Admin_Vendors;