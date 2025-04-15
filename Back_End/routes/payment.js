const express = require("express");
const router = express.Router();
const axios = require("axios");
const Booking = require("../models/Booking");
const Bus = require("../models/Bus");
const Vehicle = require("../models/Vehicle");
const Reservation = require("../models/reservationModel");
const Vendor = require("../models/Vendor");
const { sendEmail } = require("../utils/sendEmail");


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

    //Store temporarily in memory (fallback in callback)
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

      // Update booked seats
      await Bus.findByIdAndUpdate(itemId, {
        $addToSet: { bookedSeats: { $each: seats } },
      });

      // ✅ Send email to vendor
      if (bus.vendorId) {
        const vendor = await Vendor.findById(bus.vendorId);
        if (vendor?.email) {
          await sendEmail(
            vendor.email,
            "New Bus Booking on TickXplore",
            `<p>Hello ${vendor.vendorName || "Vendor"},</p>
             <p>You have a new bus booking:</p>
             <ul>
               <li><strong>Booking ID:</strong> ${booking._id}</li>
               <li><strong>User ID:</strong> ${userId}</li>
               <li><strong>Bus:</strong> ${bus.name}</li>
               <li><strong>Seats:</strong> ${seats.join(", ")}</li>
               <li><strong>Total Price:</strong> ₹${totalPrice}</li>
             </ul>`
          );
        }
      }

    } else if (type === "vehicle") {
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

      // Create reservation
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

      // Send email to vendor
      if (vehicle.vendorId) {
        const vendor = await Vendor.findById(vehicle.vendorId);
        if (vendor?.email) {
          await sendEmail(
            vendor.email,
            "New Vehicle Booking on TickXplore",
            `<p>Hello ${vendor.vendorName || "Vendor"},</p>
             <p>You have a new vehicle booking:</p>
             <ul>
               <li><strong>Booking ID:</strong> ${booking._id}</li>
               <li><strong>User ID:</strong> ${userId}</li>
               <li><strong>Vehicle:</strong> ${vehicle.name}</li>
               <li><strong>Pickup Point:</strong> ${pickupPoint}</li>
               <li><strong>Drop Point:</strong> ${dropPoint}</li>
               <li><strong>Total Price:</strong> ₹${totalPrice}</li>
             </ul>`
          );
        }
      }

    } else {
      return res.status(400).json({ error: "Invalid booking type" });
    }

    // Redirect user to frontend with success status
    return res.redirect(`http://localhost:5173/payment/callback?pidx=${pidx}&status=Completed`);

  } catch (err) {
    console.error("❌ Callback error:", err.message || err);
    return res.status(500).json({ error: "Internal server error", details: err.message });
  }
});

router.post("/cash-on-visit", async (req, res) => {
  try {
    const {
      type,
      itemId,
      userId,
      seats = [],
      takeOffDate,
      pickupPoint = "N/A",
      dropPoint = "N/A",
    } = req.body;

    let booking;
    let userEmail = "";
    let vendorEmail = "";
    const adminEmail = "tickxplore@gmail.com";
    let totalPrice = 0;

    if (type === "bus") {
      const bus = await Bus.findById(itemId).populate("vendorId");
      if (!bus) return res.status(404).json({ message: "Bus not found" });

      totalPrice = bus.pricePerSeat * seats.length;

      booking = new Booking({
        userId,
        busId: itemId,
        selectedSeats: seats,
        totalPrice,
        status: "Pending", // pending until cash received
        paymentMethod: "CashOnVisit",
        paymentStatus: "CashOnVisit",
        transactionId: `cash-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        takeOffDate: takeOffDate || bus.takeOffDate || bus.tripDate,
      });

      await booking.save();

      await Bus.findByIdAndUpdate(itemId, {
        $addToSet: { bookedSeats: { $each: seats } },
      });

      if (bus.vendorId?.email) vendorEmail = bus.vendorId.email;

    } else if (type === "vehicle") {
      const vehicle = await Vehicle.findById(itemId).populate("vendorId");
      if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

      totalPrice = vehicle.price;

      booking = new Booking({
        userId,
        vehicleId: itemId,
        totalPrice,
        status: "Pending",
        paymentMethod: "CashOnVisit",
        paymentStatus: "CashOnVisit",
        transactionId: `cash-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        reservationDate: takeOffDate || new Date(),
        pickupPoint,
        dropPoint,
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
        paymentStatus: "CashOnVisit",
        paymentId: booking._id.toString(),
      });

      await Vehicle.findByIdAndUpdate(itemId, {
        isAvailable: false,
        reservedFrom,
        reservedUntil,
        $push: { reservations: reservation._id },
      });

      if (vehicle.vendorId?.email) vendorEmail = vehicle.vendorId.email;
    }

    // ✅ Get user email
    const user = await require("../models/User").findById(userId);
    userEmail = user?.email;

    // ✅ Send email to user
    if (userEmail) {
      await sendEmail(
        userEmail,
        "Cash on Visit Booking - TickXplore",
        `
        <p>Dear ${user.name || "user"},</p>
        <p>Your booking has been created with <strong>Cash on Visit</strong>.</p>
        <p><strong>Total to Pay:</strong> Rs. ${totalPrice}</p>
        <p>Please complete your payment in person and confirm via our Gmail:</p>
        <p><strong>📧 tickxplore@gmail.com</strong></p>
        <p>Once confirmed, your booking will be activated.</p>
        <hr />
        <p>Booking ID: ${booking._id}</p>
        <p>Thank you for using TickXplore!</p>
        `
      );
    }

    // ✅ Send email to vendor
    if (vendorEmail) {
      await sendEmail(
        vendorEmail,
        "New Booking - Cash on Visit (Pending)",
        `
        <p>Hello Vendor,</p>
        <p>You have received a new <strong>Cash on Visit</strong> booking:</p>
        <ul>
          <li><strong>Booking ID:</strong> ${booking._id}</li>
          <li><strong>User ID:</strong> ${userId}</li>
          <li><strong>Total Price:</strong> Rs. ${totalPrice}</li>
          <li><strong>Status:</strong> Pending</li>
        </ul>
        <p>Please prepare for confirmation after payment.</p>
        `
      );
    }

    // ✅ Send email to admin
    await sendEmail(
      adminEmail,
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
      message: "Booking created with Cash on Visit. Emails sent.",
      bookingId: booking._id,
    });
  } catch (err) {
    console.error("CashOnVisit Error:", err.message || err);
    return res.status(500).json({ message: "Failed to book with Cash on Visit" });
  }
});



// paymentRoutes.js
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