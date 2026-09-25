const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const axios = require("axios");
const Booking = require("../models/Booking");
const Bus = require("../models/Bus");
const Vehicle = require("../models/Vehicle");
const Reservation = require("../models/Reservation");
const Vendor = require("../models/Vendor");
const { sendEmail } = require("../utils/sendEmail");
const Notification = require("../models/Notification");
const User = require("../models/User");
const Admin = require("../models/Admin");
const KHALTI_BASE_URL = "https://dev.khalti.com/api/v2/epayment/initiate/";
const KHALTI_LOOKUP_URL = "https://dev.khalti.com/api/v2/epayment/lookup/";

/* ------------------------------------------------------------------ */
/* Shared helpers                                                      */
/* ------------------------------------------------------------------ */

// Resolve the customer identity for a booking. Prefers a registered user
// account when one is supplied; otherwise falls back to the walk-in contact
// provided by the booking agent (vendor-assisted bookings).
async function resolveCustomer(body) {
  const {
    userId,
    customerName,
    customerPhone,
    customerEmail,
  } = body;

  if (userId) {
    const user = await User.findById(userId).catch(() => null);
    if (user) {
      return {
        userId: user._id,
        customerName: user.name,
        customerPhone: user.phoneNumber,
        customerEmail: user.email,
      };
    }
  }

  return {
    userId: null,
    customerName: customerName || "",
    customerPhone: customerPhone || "",
    customerEmail: customerEmail || "",
  };
}

// Run a side-effect without letting a failure break the payment flow.
async function safeRun(label, fn) {
  try {
    await fn();
  } catch (err) {
    console.error(`[payment] ${label} failed (non-blocking):`, err.message || err);
  }
}

function endOfReservationDay(date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

// Marks a booking as booked and performs all downstream effects (seat lock,
// reservation, vendor/admin commission, notifications, emails) exactly once.
async function completeBooking(booking, pidx) {
  const totalPrice = booking.totalPrice || 0;
  const commissionRate = 10;
  const commissionAmount = Math.round((commissionRate / 100) * totalPrice * 100) / 100;
  const vendorEarnings = Math.round((totalPrice - commissionAmount) * 100) / 100;
  const type = booking.busId ? "bus" : booking.vehicleId ? "vehicle" : null;
  if (!type) throw new Error("Unknown booking type");

  if (type === "bus") {
    const seats = booking.selectedSeats || [];
    const bus = await Bus.findById(booking.busId);

    await safeRun("bus seat lock", async () => {
      await Bus.findByIdAndUpdate(booking.busId, {
        $addToSet: { bookedSeats: { $each: seats } },
      });
    });

    const vendor = bus ? await Vendor.findById(bus.vendorId) : null;
    if (vendor) {
      await safeRun("bus vendor update", async () => {
        vendor.totalEarnings += vendorEarnings;
        vendor.totalCommission += commissionAmount;
        await vendor.save();

        await Notification.create({
          userId: vendor._id,
          role: "vendor",
          message: `New bus booking for "${bus.name}" (Rs. ${totalPrice})`,
        });

        if (vendor.email) {
          await sendEmail(
            vendor.email,
            "New Bus Booking - TickXplore",
            `<p>Booking ID: ${booking._id}</p><p>Total: Rs. ${totalPrice}</p>`
          );
        }
      });
    }
  } else if (type === "vehicle") {
    const vehicle = await Vehicle.findById(booking.vehicleId);
    const reservedFrom = booking.reservationDate ? new Date(booking.reservationDate) : new Date();
    const reservedUntil = endOfReservationDay(reservedFrom);

    const existingReservation = await Reservation.findOne({ paymentId: pidx }).catch(() => null);
    if (!existingReservation) {
      await safeRun("vehicle reservation", async () => {
        const reservation = await Reservation.create({
          vehicleId: booking.vehicleId,
          userId: booking.userId || undefined,
          customerName: booking.customerName || undefined,
          customerPhone: booking.customerPhone || undefined,
          customerEmail: booking.customerEmail || undefined,
          pickupPoint: booking.pickupPoint || "N/A",
          dropPoint: booking.dropPoint || "N/A",
          reservedFrom,
          reservedUntil,
          paymentStatus: "completed",
          paymentId: pidx,
        });

        await Vehicle.findByIdAndUpdate(booking.vehicleId, {
          isAvailable: false,
          reservedFrom,
          reservedUntil,
          $push: {
            reservations: {
              userId: booking.userId,
              reservedFrom,
              reservedUntil,
              pickupPoint: booking.pickupPoint || "N/A",
              dropPoint: booking.dropPoint || "N/A",
            },
          },
          $inc: {
            totalEarnings: vendorEarnings,
            totalCommission: commissionAmount,
          },
        });
      });
    }

    const vendor = vehicle ? await Vendor.findById(vehicle.vendorId) : null;
    if (vendor) {
      await safeRun("vehicle vendor update", async () => {
        vendor.totalEarnings += vendorEarnings;
        vendor.totalCommission += commissionAmount;
        await vendor.save();

        await Notification.create({
          userId: vendor._id,
          role: "vendor",
          message: `New vehicle booking for "${vehicle.name}" (Rs. ${totalPrice})`,
        });

        if (vendor.email) {
          await sendEmail(
            vendor.email,
            "New Vehicle Booking - TickXplore",
            `<p>Booking ID: ${booking._id}</p><p>Total: Rs. ${totalPrice}</p>`
          );
        }
      });
    }
  }

  // Admin commission update
  await safeRun("admin commission update", async () => {
    const admin = await Admin.findOne();
    if (admin) {
      admin.totalCommission += commissionAmount;
      await admin.save();

      await Notification.create({
        userId: admin._id,
        role: "admin",
        message: `New ${type} booking of Rs. ${totalPrice}. Commission Rs. ${commissionAmount}`,
      });

      if (admin.email) {
        await sendEmail(
          admin.email,
          "New Booking Confirmed - TickXplore",
          `<p>Booking ID: ${booking._id}</p><p>Commission: Rs. ${commissionAmount}</p>`
        );
      }
    }
  });

  // Customer confirmation
  await safeRun("customer confirmation", async () => {
    const user = booking.userId ? await User.findById(booking.userId) : null;
    const email = user?.email || booking.customerEmail;
    if (email) {
      await sendEmail(
        email,
        "Your Booking is Confirmed - TickXplore",
        `<p>Hi ${user?.name || booking.customerName || "Customer"}, your booking was successful.</p><p>Total Paid: Rs. ${totalPrice}</p>`
      );
    }

    if (user) {
      await Notification.create({
        userId: user._id,
        role: "user",
        message: `Your ${type} booking (Rs. ${totalPrice}) is confirmed.`,
      });
    }
  });

  booking.commissionAmount = commissionAmount;
  booking.vendorEarnings = vendorEarnings;
  booking.status = "Booked";
  booking.paymentStatus = "Paid";
  booking.paymentMethod = booking.paymentMethod || "Online";
  booking.transactionId = pidx;
  booking.settlementDone = true;
  await booking.save();
}

// Best-effort recovery for payments initiated before the pending-booking
// change (metadata lived only in the in-memory store / redirect data).
async function createBookingFromLegacyMeta(paymentData, query, pidx) {
  let rawExtra = paymentData.merchant_extra || query.data;
  let metadata = null;
  if (rawExtra) {
    try {
      metadata = typeof rawExtra === "string" ? JSON.parse(rawExtra) : rawExtra;
    } catch {
      metadata = null;
    }
  }
  if (!metadata && global.khaltiTempStore?.has(query.purchase_order_id)) {
    metadata = global.khaltiTempStore.get(query.purchase_order_id);
  }
  if (!metadata) return null;

  const { type, itemId, userId, seats, takeOffDate, pickupPoint, dropPoint } = metadata;
  if (!itemId || !userId) return null;

  const commissionRate = 10;
  let booking;

  if (type === "bus") {
    if (!seats || seats.length === 0) return null;
    const bus = await Bus.findById(itemId);
    if (!bus) return null;

    const totalPrice = bus.pricePerSeat * seats.length;
    const commissionAmount = Math.round((commissionRate / 100) * totalPrice * 100) / 100;
    const vendorEarnings = totalPrice - commissionAmount;

    booking = await Booking.create({
      userId,
      busId: itemId,
      selectedSeats: seats,
      totalPrice,
      status: "Pending",
      paymentStatus: "Paid",
      transactionId: pidx,
      purchaseOrderId: query.purchase_order_id,
      takeOffDate: bus.takeOffDate || bus.tripDate || new Date(takeOffDate),
      commissionAmount,
      vendorEarnings,
      settlementDone: false,
    });
  } else if (type === "vehicle") {
    const vehicle = await Vehicle.findById(itemId);
    if (!vehicle) return null;

    const totalPrice = vehicle.price;
    const commissionAmount = Math.round((commissionRate / 100) * totalPrice * 100) / 100;
    const vendorEarnings = totalPrice - commissionAmount;

    booking = await Booking.create({
      userId,
      vehicleId: itemId,
      totalPrice,
      status: "Pending",
      paymentStatus: "Paid",
      transactionId: pidx,
      purchaseOrderId: query.purchase_order_id,
      reservationDate: takeOffDate ? new Date(takeOffDate) : new Date(),
      pickupPoint: pickupPoint || "N/A",
      dropPoint: dropPoint || "N/A",
      commissionAmount,
      vendorEarnings,
      settlementDone: false,
    });
  } else {
    return null;
  }

  return booking;
}

//INITIATE PAYMENT
router.post("/initiate", async (req, res) => {
  console.log("Received Payment Request:", req.body);
  let booking = null;
  try {
    const {
      type,
      itemId,
      seats,
      userId,
      takeOffDate,
      pickupPoint,
      dropPoint,
      customerName,
      customerPhone,
      customerEmail,
    } = req.body;

    if (
      !itemId ||
      (!userId && !(customerName && customerEmail))
    ) {
      return res.status(400).json({
        message: "Missing required fields. Provide itemId and either userId or customer name + email.",
      });
    }

    let totalPrice = 0;
    let productName = "";
    let productDetails = [];
    let bus = null;
    let vehicle = null;

    if (type === "bus") {
      if (!seats || seats.length === 0) {
        return res.status(400).json({ message: "Seats are required for bus booking." });
      }

      bus = await Bus.findById(itemId);
      if (!bus) return res.status(404).json({ message: "Bus not found." });

      totalPrice = bus.pricePerSeat * seats.length;
      productName = `${bus.name} (${bus.pickupPoint} → ${bus.dropPoint})`;

      productDetails = [{
        identity: bus._id.toString(),
        name: bus.name,
        total_price: totalPrice * 100,
        quantity: 1,
        unit_price: totalPrice * 100,
      }];
    }

    else if (type === "vehicle") {
      vehicle = await Vehicle.findById(itemId);
      if (!vehicle) return res.status(404).json({ message: "Vehicle not found." });

      totalPrice = vehicle.price;
      productName = vehicle.name;

      productDetails = [{
        identity: vehicle._id.toString(),
        name: vehicle.name,
        total_price: totalPrice * 100,
        quantity: 1,
        unit_price: totalPrice * 100,
      }];
    }

    else {
      return res.status(400).json({ message: "Invalid booking type." });
    }

    const customer = await resolveCustomer(req.body);
    if (!customer.userId && !customer.customerName) {
      return res.status(400).json({ message: "Customer name is required for walk-in bookings." });
    }

    const orderId = `order-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const commissionRate = 10;
    const commissionAmount = Math.round((commissionRate / 100) * totalPrice * 100) / 100;
    const vendorEarnings = Math.round((totalPrice - commissionAmount) * 100) / 100;

    // Persist a PENDING booking BEFORE calling Khalti so the charge can never be
    // lost if the callback restarts or fails. `/callback` and `/verify` complete it.
    const bookingFields = {
      userId: customer.userId || undefined,
      customerName: customer.customerName || undefined,
      customerPhone: customer.customerPhone || undefined,
      customerEmail: customer.customerEmail || undefined,
      totalPrice,
      status: "Pending",
      paymentStatus: "Pending",
      transactionId: `pending-${orderId}`,
      purchaseOrderId: orderId,
      commissionAmount,
      vendorEarnings,
    };

    if (type === "bus") {
      bookingFields.busId = itemId;
      bookingFields.selectedSeats = seats;
      bookingFields.takeOffDate = bus.takeOffDate || bus.tripDate || new Date();
    } else {
      bookingFields.vehicleId = itemId;
      bookingFields.reservationDate = takeOffDate ? new Date(takeOffDate) : new Date();
      bookingFields.pickupPoint = pickupPoint || "N/A";
      bookingFields.dropPoint = dropPoint || "N/A";
    }

    try {
      booking = await Booking.create(bookingFields);
    } catch (createErr) {
      console.error("CREATE BOOKING ERROR:", createErr.message);
      return res.status(500).json({ message: "Failed to create booking", error: createErr.message });
    }

    // Keep a small in-memory fallback for legacy in-flight payments only.
    const metadata = { type, itemId, userId: customer.userId, customerName: customer.customerName, seats, takeOffDate, pickupPoint, dropPoint };
    global.khaltiTempStore = global.khaltiTempStore || new Map();
    global.khaltiTempStore.set(orderId, metadata);

    const payload = {
      return_url: process.env.KHALTI_RETURN_URL,
      website_url: process.env.KHALTI_WEBSITE_URL,
      amount: totalPrice * 100,
      purchase_order_id: orderId,
      purchase_order_name: productName,
      customer_info: {
        name: customer.customerName,
        email: customer.customerEmail,
        phone: customer.customerPhone,
      },
      product_details: productDetails,
      merchant_username: "tickxplore",
    };

    console.log("Sending to Khalti:", payload);
    const khaltiRes = await axios.post(KHALTI_BASE_URL, payload, {
      headers: {
        Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Khalti INITIATE RESPONSE:", khaltiRes.data);

    // Attach the real Khalti pidx to the persisted booking.
    booking.transactionId = khaltiRes.data.pidx;
    await booking.save();

    return res.status(200).json({
      payment_url: khaltiRes.data.payment_url,
      pidx: khaltiRes.data.pidx,
    });

  } catch (err) {
    console.error("INITIATE ERROR:", err.message || err);
    if (err.response?.data) console.error("Khalti error detail:", JSON.stringify(err.response.data));
    // Clean up the pending booking if Khalti rejected the initiate request.
    if (booking) {
      await Booking.deleteOne({ _id: booking._id }).catch(() => {});
    }
    return res.status(500).json({ message: "Failed to initiate payment", error: err.message });
  }
});



router.post("/verify", async (req, res) => {
  const { pidx } = req.body;

  if (!pidx) return res.status(400).json({ message: "Missing pidx" });

  try {
    const lookupRes = await axios.post(KHALTI_LOOKUP_URL, { pidx }, {
      headers: {
        Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const payment = lookupRes.data;

    if (payment.status !== "Completed") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    let booking = await Booking.findOne({ transactionId: pidx });

    if (!booking) {
      return res.status(404).json({
        message: "No booking found for this payment. Please contact support.",
      });
    }

    // Integrity check: the paid amount must match what was charged.
    const expectedPaisa = Math.round(booking.totalPrice * 100);
    if (payment.total_amount && Number(payment.total_amount) !== expectedPaisa) {
      return res.status(400).json({ message: "Payment amount mismatch" });
    }

    // Already fully processed.
    if (booking.status === "Booked" && booking.settlementDone) {
      return res.status(200).json({ message: "Already verified", status: "Booked", bookingId: booking._id });
    }

    // Complete the booking idempotently (locks seats / creates reservation).
    await completeBooking(booking, pidx);

    return res.status(200).json({
      message: "Payment verified successfully",
      status: "Booked",
      bookingId: booking._id,
    });

  } catch (err) {
    console.error("VERIFY ERROR:", err.message || err);
    return res.status(500).json({
      message: "Failed to verify payment",
      error: err.message,
    });
  }
});

router.get("/callback", async (req, res) => {
  const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
  const frontendUrl = (p, s) =>
    `${CLIENT_URL}/payment/callback?pidx=${encodeURIComponent(p || "")}&status=${encodeURIComponent(s || "unknown")}`;

  try {
    const { pidx, status, purchase_order_id } = req.query;

    if (!pidx || status !== "Completed") {
      return res.redirect(frontendUrl(pidx, status));
    }

    const lookupRes = await axios.post(KHALTI_LOOKUP_URL, { pidx }, {
      headers: {
        Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const paymentData = lookupRes.data;
    if (paymentData.status !== "Completed") {
      return res.redirect(frontendUrl(pidx, paymentData.status));
    }

    const orClauses = [{ transactionId: pidx }];
    if (purchase_order_id) orClauses.push({ purchaseOrderId: purchase_order_id });
    let booking = await Booking.findOne({ $or: orClauses });

    // Legacy fallback: recover an in-flight payment that predates the pending-booking change.
    if (!booking) {
      booking = await createBookingFromLegacyMeta(paymentData, req.query, pidx);
    }

    if (!booking) {
      return res.redirect(frontendUrl(pidx, "unverified"));
    }

    if (booking.status === "Booked" && booking.settlementDone) {
      return res.redirect(frontendUrl(pidx, "Completed"));
    }

    // Integrity check: the paid amount must match what was charged.
    const expectedPaisa = Math.round(booking.totalPrice * 100);
    if (paymentData.total_amount && Number(paymentData.total_amount) !== expectedPaisa) {
      return res.redirect(frontendUrl(pidx, "amount_mismatch"));
    }

    // Complete the booking idempotently. Side-effects are guarded so a failure
    // here can never strand a user who already paid.
    await completeBooking(booking, pidx);

    return res.redirect(frontendUrl(pidx, "Completed"));
  } catch (err) {
    console.error("❌ Callback error:", err.message || err);
    return res.status(500).json({ error: "Internal server error", details: err.message });
  }
});

router.post("/cash-on-visit", async (req, res) => {
  const {
    type,
    itemId,
    userId,
    seats,
    takeOffDate,
    pickupPoint,
    dropPoint,
    customerName,
    customerPhone,
    customerEmail,
  } = req.body;

  if (
    !itemId ||
    (!userId && !(customerName && customerEmail))
  ) {
    return res.status(400).json({
      message: "Missing required fields. Provide itemId and either userId or customer name + email.",
    });
  }

  try {
    const customer = await resolveCustomer(req.body);
    if (!customer.userId && !customer.customerName) {
      return res.status(400).json({ message: "Customer name is required for walk-in bookings." });
    }

    let totalPrice = 0, booking;
    const commissionRate = 10;
    let vendorEmail = "", productName = "", vendorId;

    if (type === "bus") {
      const bus = await Bus.findById(itemId).populate("vendorId");
      if (!bus) return res.status(404).json({ message: "Bus not found" });

      totalPrice = bus.pricePerSeat * seats.length;
      const commissionAmount = (commissionRate / 100) * totalPrice;
      const vendorEarnings = totalPrice - commissionAmount;

      booking = await Booking.create({
        userId: customer.userId || undefined,
        customerName: customer.customerName || undefined,
        customerPhone: customer.customerPhone || undefined,
        customerEmail: customer.customerEmail || undefined,
        busId: itemId,
        selectedSeats: seats,
        totalPrice,
        status: "Pending",
        paymentMethod: "CashOnVisit",
        paymentStatus: "CashOnVisit",
        transactionId: `cash-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        takeOffDate: takeOffDate || bus.takeOffDate || bus.tripDate,
        commissionAmount,
        vendorEarnings,
      });

      await Bus.findByIdAndUpdate(itemId, { $addToSet: { bookedSeats: { $each: seats } } });

      if (bus.vendorId) {
        await Vendor.findByIdAndUpdate(bus.vendorId._id, {
          $inc: { totalEarnings: vendorEarnings, totalCommission: commissionAmount },
        });
        vendorEmail = bus.vendorId.email;
        vendorId = bus.vendorId._id;
        productName = bus.name;
      }

    } else if (type === "vehicle") {
      const vehicle = await Vehicle.findById(itemId).populate("vendorId");
      if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

      totalPrice = vehicle.price;
      const commissionAmount = (commissionRate / 100) * totalPrice;
      const vendorEarnings = totalPrice - commissionAmount;

      booking = await Booking.create({
        userId: customer.userId || undefined,
        customerName: customer.customerName || undefined,
        customerPhone: customer.customerPhone || undefined,
        customerEmail: customer.customerEmail || undefined,
        vehicleId: itemId,
        totalPrice,
        status: "Pending",
        paymentMethod: "CashOnVisit",
        paymentStatus: "CashOnVisit",
        transactionId: `cash-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        reservationDate: takeOffDate || new Date(),
        pickupPoint,
        dropPoint,
        commissionAmount,
        vendorEarnings,
      });

      await Vehicle.findByIdAndUpdate(itemId, {
        isAvailable: false,
        $push: { reservations: booking._id },
        $inc: { totalEarnings: vendorEarnings, totalCommission: commissionAmount },
      });

      if (vehicle.vendorId) {
        await Vendor.findByIdAndUpdate(vehicle.vendorId._id, {
          $inc: { totalEarnings: vendorEarnings, totalCommission: commissionAmount },
        });
        vendorEmail = vehicle.vendorId.email;
        vendorId = vehicle.vendorId._id;
        productName = vehicle.name;
      }
    } else {
      return res.status(400).json({ message: "Invalid booking type" });
    }

    // ✅ Admin commission update
    const admin = await Admin.findOne();
    if (admin) {
      const commissionAmount = (commissionRate / 100) * totalPrice;
      admin.totalCommission += commissionAmount;
      await admin.save();
    }

    // ✅ Customer email + notification (walk-in welcome too)
    if (customer.customerEmail) {
      await sendEmail(
        customer.customerEmail,
        "Cash on Visit Booking - TickXplore",
        `
        <p>Dear ${customer.customerName || "Customer"},</p>
        <p>Your booking has been created with <strong>Cash on Visit</strong>.</p>
        <p><strong>Total to Pay:</strong> Rs. ${totalPrice}</p>
        <p>Please complete your payment in person and confirm via our Gmail:</p>
        <p><strong>📧 tickxplore@gmail.com</strong></p>
        <hr />
        <p>Booking ID: ${booking._id}</p>
        `
      );
    }

    if (customer.userId) {
      await Notification.create({
        userId: new mongoose.Types.ObjectId(customer.userId),
        role: "user",
        message: `Your booking for ${productName} is confirmed with Cash on Visit.`,
      });
    }

    // ✅ Vendor notification
    if (vendorId) {
      await Notification.create({
        userId: new mongoose.Types.ObjectId(vendorId),
        role: "vendor",
        message: `A new booking for ${productName} has been made with Cash on Visit.`,
      });
    }

    // ✅ Admin email
    await sendEmail(
      "tickxplore@gmail.com",
      "New Pending Cash on Visit Booking - TickXplore",
      `
      <p><strong>New Cash on Visit booking received:</strong></p>
      <ul>
        <li><strong>Booking ID:</strong> ${booking._id}</li>
        <li><strong>User ID:</strong> ${userId}</li>
        <li><strong>Payment Method:</strong> Cash on Visit</li>
        <li><strong>Status:</strong> Pending</li>
        <li><strong>Total:</strong> Rs. ${totalPrice}</li>
      </ul>
      <p>Please verify and mark as paid when confirmed.</p>
      `
    );

    return res.status(201).json({
      message: "Booking created with Cash on Visit. Notifications and emails sent.",
      bookingId: booking._id,
    });

  } catch (err) {
    console.error("❌ Error in booking process:", err.message || err);
    return res.status(500).json({ message: "Failed to process booking" });
  }
});


router.get("/cov-seats/:busId", async (req, res) => {
  try {
    const { busId } = req.params;
    const covBookings = await Booking.find({
      busId,
      paymentMethod: "CashOnVisit",
      status: "Pending"
    });

    const covSeats = covBookings.flatMap(b => b.selectedSeats);
    res.status(200).json({ covSeats });
  } catch (err) {
    console.error("Fetch CoV Seats Error:", err.message);
    res.status(500).json({ message: "Failed to fetch CoV seats" });
  }
});

// GET MY BOOKINGS
router.get("/my-bookings", async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ message: "Missing userId" });

  try {
    const bookings = await Booking.find({ userId })
      .populate("busId")
      .populate("vehicleId")
      .sort({ createdAt: -1 });

    return res.status(200).json({ bookings });

  } catch (err) {
    console.error("My Bookings Error:", err);
    return res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

module.exports = router;