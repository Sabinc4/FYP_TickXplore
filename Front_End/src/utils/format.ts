import type { Booking } from "../api/types";

/** Format a numeric amount as Nepalese Rupees (NPR). */
export const formatMoney = (value?: number | null, decimals = 0): string =>
  `NPR ${(Number(value) || 0).toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;

/** Commission attributable to a booking. */
export const commissionOf = (booking: Booking): number =>
  Number(booking.commissionAmount) || 0;

/** Net vendor earnings for a booking, falling back to price - commission when the API omits it. */
export const earningsOf = (booking: Booking): number => {
  const explicit = Number(booking.vendorEarnings) || 0;
  if (explicit > 0) return explicit;
  return Math.max(0, (Number(booking.totalPrice) || 0) - commissionOf(booking));
};