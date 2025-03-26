import React, { useState } from "react";
import EditModal from "./Admin_EditModal";

const DataTable = ({ title, data, fields, headers, renderCell, onEdit, onDelete, onToggleStatus }) => {
  const [editModal, setEditModal] = useState({
    isOpen: false,
    currentItem: null,
    field: ""
  });

  const handleEditClick = (item, field) => {
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
        <table className="w-full border border-gray-300 rounded-lg">
        <thead>
          <tr className="bg-blue-600 text-white">
            {(headers?.length ? headers : fields).map((label, idx) => (
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
              <tr key={index} className="border border-gray-300 bg-white hover:bg-gray-50 transition-colors">
                {fields.map((field, i) => (
                  <td 
                    key={i} 
                    className="border border-gray-300 px-6 py-3 cursor-pointer"
                    onClick={() => handleEditClick(item, field)}
                  >
                    {renderCell ? renderCell(item, field) : String(item[field] ?? "")}
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
                      {onEdit && (
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
      </div>
    </div>
  );
};

export default DataTable;
