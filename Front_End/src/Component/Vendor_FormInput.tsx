import type { InputHTMLAttributes } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const FormInput = ({ label, type = "text", name, value, onChange, ...props }: FormInputProps) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full rounded-lg border p-2 focus:ring-2 focus:ring-indigo-500"
      {...props}
    />
  </div>
);

export default FormInput;