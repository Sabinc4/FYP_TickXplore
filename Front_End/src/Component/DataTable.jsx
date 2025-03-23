import React from "react";

const DataTable = ({ title, data, fields, onEdit, onDelete }) => (
  <div className="p-6 bg-white shadow-md rounded-lg">
    <h2 className="text-2xl font-semibold mb-6 text-gray-800">{title}</h2>
    <table className="w-full border border-gray-300 rounded-lg">
      <thead>
        <tr className="bg-blue-600 text-white">
          {fields.map((key) => (
            <th key={key} className="border border-gray-300 px-6 py-3">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </th>
          ))}
          {(onEdit || onDelete) && (
            <th className="border border-gray-300 px-6 py-3">Actions</th>
          )}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index} className="border border-gray-300 bg-white">
            {fields.map((field, i) => (
              <td key={i} className="border border-gray-300 px-6 py-3">
                {String(item[field])}
              </td>
            ))}
            {(onEdit || onDelete) && (
              <td className="border border-gray-300 px-6 py-3 flex gap-2">
                {onEdit && (
                  <button
                    onClick={() => onEdit(item)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded-md"
                  >
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(item._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-md"
                  >
                    Delete
                  </button>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default DataTable;