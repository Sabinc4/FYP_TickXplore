import type { ReactNode } from "react";

interface InfoItemProps {
  label: string;
  value: ReactNode;
}

const InfoItem = ({ label, value }: InfoItemProps) => (
  <div>
    <span className="text-gray-500">{label}: </span>
    <span className="font-medium">{value}</span>
  </div>
);

export default InfoItem;