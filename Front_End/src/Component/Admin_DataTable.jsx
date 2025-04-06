import React, { useState } from "react";
import EditModal from "./Admin_EditModal";

const DataTable = ({ 
  title, 
  data, 
  fields, 
  headers, 
  renderCell, 
  onEdit, 
  onDelete, 
  onToggleStatus,
  disableEdit = false // New prop to disable editing
}) => {
  const [editModal, setEditModal] = useState({
    isOpen: false,
    currentItem: null,
    field: ""
  });

  const handleEditClick = (item, field) => {
    if (disableEdit) return; // Don't open edit modal if editing is disabled
    setEditModal({
      isOpen: true,
      currentItem: item,
      field: field
    });
  };

  const handleSave = (newValue) => {
    if (onEdit) {
      onEdit({
        ...editModal.currentItem,
        [editModal.field]: newValue
      });
    }
    setEditModal({ isOpen: false, currentItem: null, field: "" });
  };

  const renderCellContent = (item, field) => {
    try {
      if (renderCell) {
        const rendered = renderCell(item, field);
        return rendered !== null && rendered !== undefined 
          ? String(rendered) 
          : "-";
      }
      
      const value = item[field];
      
      if (value === null || value === undefined) {
        return "-";
      }
      
      if (typeof value === 'object') {
        return value.name || value._id || JSON.stringify(value);
      }
      
      return String(value);
    } catch (error) {
      console.error(`Error rendering cell for field ${field}:`, error);
      return "Error";
    }
  };

  const displayHeaders = headers?.length ? headers : fields;

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">{title}</h2>
      
      <EditModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, currentItem: null, field: "" })}
        title={`Edit ${editModal.field}`}
        initialValue={editModal.currentItem ? editModal.currentItem[editModal.field] : ""}
        onSave={handleSave}
        label={editModal.field}
      />

      <div className="overflow-x-auto">
        {data.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No data available
          </div>
        ) : (
          <table className="w-full border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-blue-600 text-white">
                {displayHeaders.map((label, idx) => (
                  <th key={idx} className="border border-gray-300 px-6 py-3">
                    {label}
                  </th>
                ))}
                {onToggleStatus && (
                  <th className="border border-gray-300 px-6 py-3">Status</th>
                )}
                {(onEdit || onDelete) && (
                  <th className="border border-gray-300 px-6 py-3">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr 
                  key={index} 
                  className="border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
                >
                  {fields.map((field, i) => (
                    <td 
                      key={i} 
                      className={`border border-gray-300 px-6 py-3 ${
                        !disableEdit ? "cursor-pointer" : ""
                      }`}
                      onClick={() => !disableEdit && handleEditClick(item, field)}
                    >
                      {renderCellContent(item, field)}
                    </td>
                  ))}
                  {onToggleStatus && (
                    <td className="border border-gray-300 px-6 py-3">
                      <button
                        onClick={() => onToggleStatus(item._id)}
                        className={`px-3 py-1 rounded-md text-white ${
                          item.isActive ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {item.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  )}
                  {(onEdit || onDelete) && (
                    <td className="border border-gray-300 px-6 py-3">
                      <div className="flex gap-2">
                        {onEdit && !disableEdit && ( // Only show edit button if not disabled
                          <button
                            onClick={() => handleEditClick(item, fields[0])}
                            className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                          >
                            Edit
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(item._id)}
                            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DataTable;