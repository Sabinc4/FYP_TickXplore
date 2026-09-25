const PDFDocument = require("pdfkit");
const Booking = require("../models/Booking");
const Bus = require("../models/Bus");
const Vehicle = require("../models/Vehicle");
const User = require("../models/User");
const { sendEmail } = require("./sendEmail");

/* ------------------------------------------------------------------ */
/* Seat labels (same 4-per-row layout as the seat map / ticket card)   */
/* ------------------------------------------------------------------ */

// A1…J4 style label, matching the frontend seat map.
function formatSeatLabel(seat) {
  const n = Number(seat);
  if (!Number.isFinite(n) || n <= 0) return String(seat);
  const row = Math.floor((n - 1) / 4);
  const col = ((n - 1) % 4) + 1;
  return `${String.fromCharCode(65 + row)}${col}`;
}

/* ------------------------------------------------------------------ */
/* Booking number: "<ITEM NAME>-<SEATS / DATE>"                       */
/* ------------------------------------------------------------------ */

function isBusBooking(booking) {
  return !!booking.busId;
}

// Human-friendly reference persisted on the booking, e.g.
// "Mountain Express-2B" for a bus or "Hatchback-2026-09-25" for a vehicle.
function bookingNumberFor(booking) {
  const hasBus = isBusBooking(booking);
  const item = hasBus ? booking.busId : booking.vehicleId;
  const rawName =
    item && typeof item === "object" && item.name ? String(item.name).trim() : "Ticket";
  const baseName = rawName.replace(/\s+/g, "-");

  if (hasBus) {
    const labels = (booking.selectedSeats || []).map(formatSeatLabel).join("-");
    return labels ? `${baseName}-${labels}` : baseName;
  }

  const date = booking.reservationDate || booking.date;
  if (!date) return baseName;
  const key = new Date(date).toLocaleDateString("en-CA");
  return `${baseName}-${key}`;
}

function ticketSubject(booking, number) {
  return `Your Ticket - ${number || "TickXplore"}`;
}

/* ------------------------------------------------------------------ */
/* Item resolution (works with populated or plain bookings)            */
/* ------------------------------------------------------------------ */

async function resolveItemDetails(booking) {
  const hasBus = isBusBooking(booking);
  const id = hasBus ? booking.busId : booking.vehicleId;
  let item = hasBus ? booking.busId : booking.vehicleId;

  if (!item || typeof item !== "object" || !item.name) {
    const Model = hasBus ? Bus : Vehicle;
    item = id ? await Model.findById(id).catch(() => null) : null;
  }

  return { isBus: hasBus, item };
}

function departureLabel(booking, itemInfo) {
  const date =
    booking.takeOffDate || booking.reservationDate || booking.date || (itemInfo.item && itemInfo.item.takeOffDate);
  return date ? new Date(date).toLocaleString() : "N/A";
}

function routeLabel(booking, itemInfo) {
  const item = itemInfo.item || {};
  if (itemInfo.isBus) {
    return `${item.pickupPoint || booking.pickupPoint || "N/A"} → ${item.dropPoint || booking.dropPoint || "N/A"}`;
  }
  return `${booking.pickupPoint || item.pickupPoint || "N/A"} → ${booking.dropPoint || item.dropPoint || "N/A"}`;
}

function seatsLabel(booking, itemInfo) {
  if (itemInfo.isBus) {
    return (booking.selectedSeats || []).map(formatSeatLabel).join(", ") || "N/A";
  }
  return "Whole vehicle";
}

function paymentLabel(booking) {
  const cashOnVisit =
    booking.paymentMethod === "CashOnVisit" || booking.paymentStatus === "CashOnVisit";
  return cashOnVisit ? "Cash on Visit" : booking.paymentStatus === "Pending" ? "Online (Khalti) — Pending" : "Online (Khalti)";
}

/* ------------------------------------------------------------------ */
/* Email HTML                                                          */
/* ------------------------------------------------------------------ */

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]));
}

function buildTicketHtml(booking, itemInfo) {
  const customerName = booking.customerName || "Customer";
  const number = booking.bookingNumber || bookingNumberFor(booking);
  const commission = Math.round(0.1 * (booking.totalPrice || 0) * 100) / 100;
  const itemName = itemInfo.item?.name || "TickXplore trip";

  const passengersRows = (booking.passengers || [])
    .filter((p) => p && p.name)
    .map(
      (p) =>
        `<tr><td>${escapeHtml(p.name)}</td><td>${escapeHtml(p.phone || "-")}</td></tr>`
    )
    .join("");

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
      <div style="background: #2563eb; color: #fff; padding: 16px 20px;">
        <h2 style="margin: 0;">Your Ticket — TickXplore</h2>
      </div>
      <div style="padding: 20px;">
        <p>Dear <strong>${escapeHtml(customerName)}</strong>, here is your ticket:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr><td style="padding: 8px 0; color: #6b7280;">Booking Number</td><td style="padding: 8px 0;"><strong>${escapeHtml(number)}</strong></td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Booking ID</td><td style="padding: 8px 0;"><strong>${escapeHtml(booking._id || "")}</strong></td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Transport</td><td style="padding: 8px 0;"><strong>${escapeHtml(itemName)}</strong></td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Route</td><td style="padding: 8px 0;"><strong>${escapeHtml(routeLabel(booking, itemInfo))}</strong></td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Departure</td><td style="padding: 8px 0;"><strong>${escapeHtml(departureLabel(booking, itemInfo))}</strong></td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Seats</td><td style="padding: 8px 0;"><strong>${escapeHtml(seatsLabel(booking, itemInfo))}</strong></td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Total Paid</td><td style="padding: 8px 0;"><strong>Rs. ${booking.totalPrice || 0}</strong></td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Payment</td><td style="padding: 8px 0;"><strong>${escapeHtml(paymentLabel(booking))}</strong></td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280;">Status</td><td style="padding: 8px 0;"><strong>${escapeHtml(booking.status || "Pending")}</strong></td></tr>
        </table>
        ${
          passengersRows
            ? `<p style="color: #6b7280; margin-bottom: 4px;">Passengers:</p>
               <table style="width: 100%; border-collapse: collapse;">
                 <tr style="background: #f3f4f6; text-align: left;">
                   <th style="padding: 8px;">Name</th><th style="padding: 8px;">Phone</th>
                 </tr>${passengersRows}
               </table>`
            : ""
        }
        <p style="font-size: 12px; color: #9ca3af; margin-top: 20px;">
          Your ticket is also attached as a PDF. For any changes please contact TickXplore support.
        </p>
      </div>
    </div>`;
}

/* ------------------------------------------------------------------ */
/* Ticket PDF                                                          */
/* ------------------------------------------------------------------ */

function kv(doc, label, value, y) {
  doc.font("Helvetica-Bold", 9).fillColor("#6b7280").text(label, 50, y);
  doc
    .font("Helvetica-Bold", 10)
    .fillColor("#0f172a")
    .text(String(value ?? "-"), 170, y - 4, { width: 380 });
  return y + 20;
}

function buildTicketPdf(booking, itemInfo) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 40, bottom: 40, left: 50, right: 50 },
    });
    const chunks = [];
    doc.on("data", (c) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const number = booking.bookingNumber || bookingNumberFor(booking);
    const itemName = itemInfo.item?.name || "TickXplore trip";

    // Header band
    doc.rect(0, 0, 595.28, 90).fill("#2563eb");
    doc
      .fillColor("#ffffff")
      .font("Helvetica-Bold", 22)
      .text("TickXplore", 50, 28);
    doc
      .font("Helvetica", 11)
      .text("E-TICKET", 50, 58);

    doc
      .fillColor("#0f172a")
      .font("Helvetica-Bold", 16)
      .text(`Booking Number: ${number}`, 50, 120);

    let y = 160;
    y = kv(doc, "Booking ID", booking._id || "-", y);
    y = kv(doc, "Transport", itemName, y);
    y = kv(doc, "Route", routeLabel(booking, itemInfo), y);
    y = kv(doc, "Departure", departureLabel(booking, itemInfo), y);
    y = kv(doc, "Seats", seatsLabel(booking, itemInfo), y);
    y = kv(doc, "Passenger", booking.customerName || (booking.passengers && booking.passengers[0]?.name) || "Customer", y);
    y = kv(doc, "Total", `Rs. ${booking.totalPrice || 0}`, y);
    y = kv(doc, "Payment", paymentLabel(booking), y);
    y = kv(doc, "Status", booking.status || "Pending", y);

    // Passengers table
    const passengers = (booking.passengers || []).filter((p) => p && p.name);
    if (passengers.length > 0) {
      y += 10;
      doc.font("Helvetica-Bold", 11).fillColor("#0f172a").text("Passengers", 50, y);
      y += 24;
      doc.font("Helvetica-Bold", 9).fillColor("#334155");
      doc.text("Name", 50, y);
      doc.text("Phone", 300, y);
      y += 8;
      doc.moveTo(50, y).lineTo(545, y).strokeColor("#cbd5e1").stroke();
      doc.font("Helvetica", 9).fillColor("#0f172a");
      passengers.forEach((p) => {
        y += 18;
        doc.text(p.name, 50, y);
        doc.text(p.phone || "-", 300, y);
      });
    }

    doc
      .font("Helvetica", 8)
      .fillColor("#94a3b8")
      .text(
        `Issued ${new Date().toLocaleString()} · For changes contact TickXplore support.`,
        50,
        760
      );

    doc.end();
  });
}

/* ------------------------------------------------------------------ */
/* Send engine                                                         */
/* ------------------------------------------------------------------ */

async function resolveRecipient(booking) {
  if (booking.customerEmail) {
    return { email: booking.customerEmail, name: booking.customerName || "Customer" };
  }

  const userId = booking.userId;
  if (userId && typeof userId === "object" && userId.email) {
    return { email: userId.email, name: userId.name || booking.customerName || "Customer" };
  }

  try {
    const user = await User.findById(userId);
    if (user && user.email) {
      return { email: user.email, name: booking.customerName || user.name || "Customer" };
    }
  } catch {
    // ignore lookups that fail
  }

  return { email: null, name: booking.customerName || "Customer" };
}

function sanitizeFilename(value) {
  return String(value).replace(/[^A-Za-z0-9-_]/g, "-").replace(/--+/g, "-");
}

async function updateEmailState(booking, status, emailSentAt, emailError) {
  const update = {
    emailStatus: status,
    emailSentAt,
    emailError: emailError ? String(emailError).slice(0, 500) : undefined,
  };
  if (!booking.bookingNumber) update.bookingNumber = bookingNumberFor(booking);
  try {
    await Booking.findByIdAndUpdate(booking._id, update);
  } catch (err) {
    console.error("[ticketService] failed to persist email status:", err.message);
  }
}

// Generates the PDF ticket + HTML email, delivers them, and records the
// delivery state on the booking. Never throws: the caller's payment/booking
// flow must not be broken by an email failure.
async function sendTicketEmail(booking) {
  const itemInfo = await resolveItemDetails(booking);
  const recipient = await resolveRecipient(booking);

  if (!recipient.email) {
    await updateEmailState(booking, "None", null, "No customer email on file");
    return { status: "None", error: "No customer email on file" };
  }

  let pdfBuffer;
  try {
    pdfBuffer = await buildTicketPdf(booking, itemInfo);
  } catch (err) {
    await updateEmailState(booking, "Failed", null, err.message);
    return { status: "Failed", error: err.message };
  }

  const number = booking.bookingNumber || bookingNumberFor(booking);
  const filename = `${sanitizeFilename(number)}-ticket.pdf`;
  const html = buildTicketHtml(booking, itemInfo);

  try {
    await sendEmail(recipient.email, ticketSubject(booking, number), html, [
      { filename, content: pdfBuffer, contentType: "application/pdf" },
    ]);
    await updateEmailState(booking, "Sent", new Date(), null);
    return { status: "Sent" };
  } catch (err) {
    await updateEmailState(booking, "Failed", null, err.message);
    return { status: "Failed", error: err.message };
  }
}

module.exports = {
  formatSeatLabel,
  bookingNumberFor,
  buildTicketPdf,
  buildTicketHtml,
  sendTicketEmail,
  resolveItemDetails,
};