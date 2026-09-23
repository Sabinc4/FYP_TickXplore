import { useEffect, useMemo, useState } from "react";
import { getPageRange } from "../utils/pagination";

interface DataTableProps<T extends { _id?: string }> {
  title: string;
  data: T[];
  fields: string[];
  headers?: string[];
  renderCell?: (item: T, field: string) => string | number | null;
  onDelete?: (id: string) => void;
  onToggleStatus?: (id: string) => void;
  onApproveStatus?: (id: string) => void;
  onDeclineStatus?: (id: string) => void;
  disableDelete?: (item: T) => boolean;
  hideTitle?: boolean;
  pageSize?: number;
}

const getCellValue = (value: unknown): string => {
  if (value === null || value === undefined) return "-";
  if (typeof value === "object") {
    const obj = value as { name?: string; _id?: string };
    return obj.name || obj._id || JSON.stringify(value);
  }
  return String(value);
};

const resolvePath = (obj: unknown, path: string): unknown =>
  path
    .split(".")
    .reduce<unknown>((acc, key) =>
      acc && typeof acc === "object" ? (acc as Record<string, unknown>)[key] : undefined,
      obj);

const DataTable = <T extends { _id?: string }>({
  title,
  data,
  fields,
  headers,
  renderCell,
  onDelete,
  onToggleStatus,
  onApproveStatus,
  onDeclineStatus,
  disableDelete,
  hideTitle = false,
  pageSize = 10,
}: DataTableProps<T>) => {
  const [confirmDelete, setConfirmDelete] = useState<T | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    item: T;
    action: "activate" | "deactivate" | "approve" | "decline";
  } | null>(null);
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  const safePage = Math.min(page, totalPages);

  const pagedData = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, safePage, pageSize]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, data.length);

  const renderCellContent = (item: T, field: string): string => {
    try {
      if (renderCell) {
        const rendered = renderCell(item, field);
        if (rendered !== null && rendered !== undefined) return String(rendered);
      }
      return getCellValue(field.includes(".") ? resolvePath(item, field) : item[field as keyof T]);
    } catch (error) {
      console.error(`Error rendering cell for field ${field}:`, error);
      return "Error";
    }
  };

  const displayHeaders = headers?.length ? headers : fields;

  const appStatus = (item: T): string =>
    String((item as Record<string, unknown>).applicationStatus ?? "");

  const decisionText: Record<string, { label: string; confirm: string; buttonClass: string }> = {
    activate: { label: "activate", confirm: "Activate", buttonClass: "bg-emerald-600 hover:bg-emerald-700" },
    deactivate: { label: "deactivate", confirm: "Deactivate", buttonClass: "bg-rose-600 hover:bg-rose-700" },
    approve: { label: "accept", confirm: "Accept", buttonClass: "bg-emerald-600 hover:bg-emerald-700" },
    decline: { label: "decline", confirm: "Decline", buttonClass: "bg-rose-600 hover:bg-rose-700" },
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-card">
      {!hideTitle && <h2 className="mb-6 text-2xl font-semibold text-slate-800">{title}</h2>}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-card-lg">
            <h2 className="mb-4 text-xl font-bold text-gray-800">Confirm Deletion</h2>
            <p className="mb-6 text-gray-500">
              Are you sure you want to delete this item? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setConfirmDelete(null)}
                className="rounded-xl bg-gray-200 px-4 py-2 text-gray-700 transition hover:bg-gray-300"
              >
                No
              </button>
              <button
                onClick={() => {
                  onDelete?.(confirmDelete._id!);
                  setConfirmDelete(null);
                }}
                className="rounded-xl bg-rose-600 px-4 py-2 text-white transition hover:bg-rose-700"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-card-lg">
            <h2 className="mb-4 text-xl font-bold text-gray-800">
              Confirm {decisionText[confirmAction.action]?.confirm}
            </h2>
            <p className="mb-6 text-gray-500">
              Are you sure you want to{" "}
              {decisionText[confirmAction.action]?.label} this item?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setConfirmAction(null)}
                className="rounded-xl bg-gray-200 px-4 py-2 text-gray-700 transition hover:bg-gray-300"
              >
                No
              </button>
              <button
                onClick={() => {
                  const { item, action } = confirmAction;
                  if (action === "approve") onApproveStatus?.(item._id!);
                  else if (action === "decline") onDeclineStatus?.(item._id!);
                  else onToggleStatus?.(item._id!);
                  setConfirmAction(null);
                }}
                className={`rounded-xl px-4 py-2 text-white transition ${decisionText[confirmAction.action]?.buttonClass}`}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        {data.length === 0 ? (
          <div className="py-4 text-center text-gray-500">No data available</div>
        ) : (
          <table className="w-full border rounded-lg border-gray-300">
            <thead>
              <tr className="bg-indigo-600 text-white">
                {displayHeaders.map((label, idx) => (
                  <th
                    key={idx}
                    className="border border-gray-300 px-4 py-3 whitespace-nowrap"
                  >
                    {label}
                  </th>
                ))}
                {(onToggleStatus || onApproveStatus) && (
                  <th className="border border-gray-300 px-6 py-3">Status</th>
                )}
                {(onDelete) && (
                  <th className="border border-gray-300 px-6 py-3">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {pagedData.map((item, index) => (
                <tr
                  key={item._id ?? index}
                  className="border border-gray-300 bg-white transition-colors hover:bg-slate-50"
                >
                  {fields.map((field, i) => (
                    <td
                      key={i}
                      title={renderCellContent(item, field)}
                      className="break-words border border-gray-300 px-4 py-3 text-justify"
                    >
                      {renderCellContent(item, field)}
                    </td>
                  ))}
                  {(onToggleStatus || onApproveStatus) && (
                  <td className="border border-gray-300 px-4 py-3">
                    {appStatus(item) === "pending" ||
                    appStatus(item) === "declined" ? (
                      <div className="flex flex-wrap items-center gap-2 whitespace-nowrap">
                        {appStatus(item) === "declined" && (
                          <span className="rounded-md bg-rose-100 px-3 py-1 text-rose-700">
                            Declined
                          </span>
                        )}
                        <button
                          onClick={() => setConfirmAction({ item, action: "approve" })}
                          className="rounded-md bg-emerald-600 px-3 py-1 text-white transition-colors hover:bg-emerald-700"
                        >
                          Accept
                        </button>
                        {appStatus(item) === "pending" && (
                          <button
                            onClick={() => setConfirmAction({ item, action: "decline" })}
                            className="rounded-md bg-rose-600 px-3 py-1 text-white transition-colors hover:bg-rose-700"
                          >
                            Decline
                          </button>
                        )}
                      </div>
                    ) : (
                      onToggleStatus && (
                        <button
                          onClick={() =>
                            setConfirmAction({
                              item,
                              action: (item as Record<string, unknown>).isActive
                                ? "deactivate"
                                : "activate",
                            })
                          }
                          className={`rounded-md px-3 py-1 whitespace-nowrap text-white ${
                            (item as Record<string, unknown>).isActive
                              ? "bg-rose-600 hover:bg-rose-700"
                              : "bg-emerald-600 hover:bg-emerald-700"
                          }`}
                        >
                          {(item as Record<string, unknown>).isActive
                            ? "Deactivate"
                            : "Activate"}
                        </button>
                      )
                    )}
                  </td>
                )}
                  {(onDelete) && (
                    <td className="border border-gray-300 px-4 py-3">
                      <div className="flex gap-2 whitespace-nowrap">
                        {!disableDelete?.(item) && (
                          <button
                            onClick={() => setConfirmDelete(item)}
                            className="rounded-md bg-rose-500 px-3 py-1 whitespace-nowrap text-white transition-colors hover:bg-rose-600"
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

      {data.length > 0 && (
        <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-sm text-gray-500">
            Showing {startIndex + 1}-{endIndex} of {data.length}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Prev
            </button>
            {getPageRange(safePage, totalPages).map((p, i) =>
              p === "..." ? (
                <span
                  key={`ellipsis-${i}`}
                  className="px-2 py-1 text-sm text-gray-400"
                >
                  ...
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`rounded-md px-3 py-1 text-sm transition-colors ${
                    p === safePage
                      ? "bg-indigo-600 text-white"
                      : "border border-gray-300 text-gray-600 hover:bg-slate-100"
                  }`}
                >
                  {p}
                </button>
              )
            )}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;