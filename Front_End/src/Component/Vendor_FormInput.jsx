import React from "react";

const FormInput = ({ label, type = "text", name, value, onChange, ...props }) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
      {...props}
    />
  </div>
);

export default FormInput;