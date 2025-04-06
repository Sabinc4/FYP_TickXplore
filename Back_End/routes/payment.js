const express = require("express");
const router = express.Router();
const axios = require("axios");
const Booking = require("../models/Booking");
const Bus = require("../models/Bus");
const Vehicle = require("../models/Vehicle");
const Reservation = require("../models/reservationModel");


const KHALTI_BASE_URL = "https://dev.khalti.com/api/v2/epayment/initiate/";
const KHALTI_LOOKUP_URL = "https://dev.khalti.com/api/v2/epayment/lookup/";

//INITIATE PAYMENT
router.post("/initiate", async (req, res) => {
  console.log("Received Payment Request:", req.body);
  try {
    const {
      type,
      itemId,
      userInfo,
      seats,
      userId,
      takeOffDate,
      pickupPoint,
      dropPoint,
    } = req.body;

    if (!itemId || !userInfo || !userId) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    let totalPrice = 0;
    let productName = "";
    let productDetails = [];

    if (type === "bus") {
      if (!seats || seats.length === 0) {
        return res.status(400).json({ message: "Seats are required for bus booking." });
      }

      const bus = await Bus.findById(itemId);
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
      const vehicle = await Vehicle.findById(itemId);
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

    const orderId = `order-${Date.now()}`;
    const metadata = {
      type,
      itemId,
      userId,
      seats,
      takeOffDate,
      pickupPoint,
      dropPoint,
    };

    // 💾 Store temporarily in memory (fallback in callback)
    global.khaltiTempStore = global.khaltiTempStore || new Map();
    global.khaltiTempStore.set(orderId, metadata);

    const payload = {
      return_url: process.env.KHALTI_RETURN_URL,
      website_url: process.env.KHALTI_WEBSITE_URL,
      amount: totalPrice * 100,
      purchase_order_id: orderId,
      purchase_order_name: productName,
      customer_info: userInfo,
      product_details: productDetails,
      merchant_extra: JSON.stringify(metadata),
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

    return res.status(200).json({
      payment_url: khaltiRes.data.payment_url,
      pidx: khaltiRes.data.pidx,
    });

  } catch (err) {
    console.error("INITIATE ERROR:", err.message || err);
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

    const booking = await Booking.findOne({ transactionId: pidx });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found. It should have been created via /callback.",
      });
    }

    // Already verified
    if (booking.status === "Booked") {
      return res.status(200).json({ message: "Already verified", status: "Booked" });
    }

    // Update booking status
    booking.status = "Booked";
    await booking.save();

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
  try {
    const { pidx, status, purchase_order_id } = req.query;

    if (!pidx || status !== "Completed") {
      return res.status(400).json({ error: "Invalid payment details" });
    }

    const lookupRes = await axios.post(KHALTI_LOOKUP_URL, { pidx }, {
      headers: {
        Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const paymentData = lookupRes.data;

    if (paymentData.status !== "Completed") {
      return res.status(400).json({ error: "Payment verification failed" });
    }

    // 🌐 Try all possible locations for metadata
    let rawExtra = paymentData.merchant_extra || paymentData.merchant_data || paymentData.extra || req.query.data;

    let metadata;
    if (rawExtra) {
      try {
        metadata = typeof rawExtra === "string" ? JSON.parse(rawExtra) : rawExtra;
      } catch (err) {
        return res.status(400).json({ error: "Invalid JSON in metadata", details: err.message });
      }
    } else if (global.khaltiTempStore?.has(purchase_order_id)) {
      metadata = global.khaltiTempStore.get(purchase_order_id);
      console.log("💡 Retrieved metadata from memory for:", purchase_order_id);
    } else {
      return res.status(400).json({ error: "Missing metadata in response and memory" });
    }

    const { type, itemId, userId, seats, takeOffDate, pickupPoint, dropPoint } = metadata;

    const existingBooking = await Booking.findOne({ transactionId: pidx });
    if (existingBooking) {
      return res.redirect(`http://localhost:5173/payment/callback?pidx=${pidx}&status=Completed`);
    }

    let booking;

    if (type === "bus") {
      const bus = await Bus.findById(itemId);
      if (!bus) return res.status(404).json({ error: "Bus not found" });

      const totalPrice = bus.pricePerSeat * seats.length;

      booking = new Booking({
        userId,
        busId: itemId,
        selectedSeats: seats,
        totalPrice,
        status: "Booked",
        transactionId: pidx,
        takeOffDate: bus.takeOffDate || bus.tripDate || new Date(takeOffDate),
      });

      await booking.save();

      await Bus.findByIdAndUpdate(itemId, {
        $addToSet: { bookedSeats: { $each: seats } },
      });
    }

    else if (type === "vehicle") {
      const vehicle = await Vehicle.findById(itemId);
      if (!vehicle) return res.status(404).json({ error: "Vehicle not found" });

      const totalPrice = vehicle.price;

      booking = new Booking({
        userId,
        vehicleId: itemId,
        totalPrice,
        status: "Booked",
        transactionId: pidx,
        reservationDate: takeOffDate || new Date(),
        pickupPoint: pickupPoint || "N/A",
        dropPoint: dropPoint || "N/A",
      });

      await booking.save();

      const reservedFrom = new Date(booking.reservationDate);
      const reservedUntil = new Date(booking.reservationDate);

      const reservation = await Reservation.create({
        vehicleId: itemId,
        userId,
        pickupPoint,
        dropPoint,
        reservedFrom,
        reservedUntil,
        paymentStatus: "completed",
        paymentId: pidx,
      });

      await Vehicle.findByIdAndUpdate(itemId, {
        isAvailable: false,
        reservedFrom,
        reservedUntil,
        $push: { reservations: reservation._id },
      });
    }

    else {
      return res.status(400).json({ error: "Invalid booking type" });
    }

    return res.redirect(`http://localhost:5173/payment/callback?pidx=${pidx}&status=Completed`);

  } catch (err) {
    console.error("❌ Callback error:", err.message || err);
    return res.status(500).json({ error: "Internal server error", details: err.message });
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