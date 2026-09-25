interface EmailStatusBadgeProps {
  status?: string;
  error?: string;
}

const EmailStatusBadge = ({ status, error }: EmailStatusBadgeProps) => {
  if (!status) return null;
  const label =
    status === "Sent"
      ? "Email Sent"
      : status === "Failed"
      ? "Email Failed"
      : status === "None"
      ? "No Email"
      : "Email Pending";
  const cls =
    status === "Sent"
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700"
      : status === "Failed"
      ? "border-rose-500/30 bg-rose-500/10 text-rose-600"
      : "border-amber-500/30 bg-amber-500/10 text-amber-700";
  return (
    <span
      title={error || label}
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cls}`}
    >
      {label}
    </span>
  );
};

export default EmailStatusBadge;