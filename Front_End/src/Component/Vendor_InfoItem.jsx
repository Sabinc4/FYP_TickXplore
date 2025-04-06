import React from "react";

const InfoItem = ({ label, value }) => (
  <div>
    <span className="text-gray-500">{label}: </span>
    <span className="font-medium">{value}</span>
  </div>
);

export default InfoItem;