interface LogoutConfirmModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const LogoutConfirmModal = ({ open, onCancel, onConfirm }: LogoutConfirmModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-card-lg">
        <h2 className="mb-4 text-xl font-bold text-gray-800">Confirm Logout</h2>
        <p className="mb-6 text-gray-500">
          Are you sure you want to log out of your account?
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="rounded-xl bg-gray-200 px-4 py-2 text-gray-700 transition hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-xl bg-rose-600 px-4 py-2 text-white transition hover:bg-rose-700"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmModal;