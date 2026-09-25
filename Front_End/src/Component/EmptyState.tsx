import { FaSearchLocation } from "react-icons/fa";

interface EmptyStateProps {
  onClearFilters: () => void;
}

const EmptyState = ({ onClearFilters }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-blue-200 bg-[#F0F7FF] px-6 py-16 text-center">
    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-3xl text-blue-500">
      <FaSearchLocation />
    </span>
    <h3 className="mt-5 text-xl font-bold text-slate-900">No stays found</h3>
    <p className="mt-2 max-w-sm text-sm text-slate-500">
      Try adjusting your filters or exploring a different location.
    </p>
    <button
      type="button"
      onClick={onClearFilters}
      className="mt-6 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
    >
      Clear Filters
    </button>
  </div>
);

export default EmptyState;