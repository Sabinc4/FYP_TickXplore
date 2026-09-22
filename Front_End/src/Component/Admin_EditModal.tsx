import { useState, useEffect } from "react";
import { toast } from "react-toastify";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  initialValue: string;
  onSave: (value: string) => void;
  fieldName: string;
}

const EditModal = ({
  isOpen,
  onClose,
  title,
  initialValue,
  onSave,
  fieldName,
}: EditModalProps) => {
  const [value, setValue] = useState<string>(initialValue);

  useEffect(() => {
    if (isOpen) {
      setValue(initialValue);
    }
  }, [isOpen, initialValue]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        <div className="p-6">
          <h3 className="mb-4 text-xl font-semibold text-gray-800">{title}</h3>
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {fieldName}
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (value.trim() === "") {
                  toast.error(`${fieldName} cannot be empty`);
                  return;
                }
                onSave(value);
              }}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditModal;