const express = require("express");
const router = express.Router();
const axios = require("axios");
const Booking = require("../models/Booking");
const Bus = require("../models/Bus");
const Vehicle = require("../models/Vehicle");

const KHALTI_BASE_URL = "https://dev.khalti.com/api/v2/epayment/initiate/";
const KHALTI_LOOKUP_URL = "https://dev.khalti.com/api/v2/epayment/lookup/";

// ✅ INITIATE PAYMENT
router.post("/initiate", async (req, res) => {
  try {
    const { type, itemId, userInfo, seats, userId, takeOffDate } = req.body;

    if (!itemId || !userInfo || !userId) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    let totalPrice = 0;
    let booking;
    let orderId = "";
    let productName = "";
    let productDetails = [];
    let productType = "";

    // 🚌 Bus Payment
    if (type === "bus") {
      if (!seats || seats.length === 0) {
        return res.status(400).json({ message: "Seats are required for bus booking." });
      }

      const bus = await Bus.findById(itemId);
      if (!bus) return res.status(404).json({ message: "Bus not found." });

      totalPrice = bus.pricePerSeat * seats.length;

      booking = new Booking({
        userId,
        busId: bus._id,
        selectedSeats: seats,
        totalPrice,
        status: "Pending",
      });

      productName = `${bus.name} (${bus.pickupPoint} → ${bus.dropPoint})`;
      productDetails = [{
        identity: bus._id.toString(),
        name: bus.name,
        total_price: totalPrice * 100,
        quantity: 1,
        unit_price: totalPrice * 100,
      }];
      productType = "bus";
      orderId = `bus-${booking._id}-${Date.now()}`;
    }

    // 🚙 Vehicle Payment
    else if (type === "vehicle") {
      const vehicle = await Vehicle.findById(itemId);
      if (!vehicle) return res.status(404).json({ message: "Vehicle not found." });

      totalPrice = vehicle.price;

      booking = new Booking({
        userId,
        vehicleId: vehicle._id,
        totalPrice,
        status: "Pending",
        reservationDate: takeOffDate || new Date(),
      });

      productName = `${vehicle.name} (${vehicle.pickupPoint} → ${vehicle.dropPoint})`;
      productDetails = [{
        identity: vehicle._id.toString(),
        name: vehicle.name,
        total_price: totalPrice * 100,
        quantity: 1,
        unit_price: totalPrice * 100,
      }];
      productType = "vehicle";
      orderId = `vehicle-${booking._id}-${Date.now()}`;
    }

    // ❌ Invalid Type
    else {
      return res.status(400).json({ message: "Invalid payment type." });
    }

    await booking.save();

    const payload = {
      return_url: process.env.KHALTI_RETURN_URL,
      website_url: process.env.KHALTI_WEBSITE_URL,
      amount: totalPrice * 100,
      purchase_order_id: orderId,
      purchase_order_name: productName,
      customer_info: userInfo,
      product_details: productDetails,
      merchant_extra: productType,
      merchant_username: "tickxplore",
    };

    const khaltiRes = await axios.post(KHALTI_BASE_URL, payload, {
      headers: {
        Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });

    booking.transactionId = khaltiRes.data.pidx;
    await booking.save();

    return res.status(200).json({ payment_url: khaltiRes.data.payment_url, pidx: khaltiRes.data.pidx });

  } catch (err) {
    console.error("❌ INITIATE ERROR:", err.message || err);
    return res.status(500).json({ message: "Failed to initiate payment", error: err.message });
  }
});

// ✅ VERIFY PAYMENT
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

    if (lookupRes.data.status !== "Completed") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    const booking = await Booking.findOne({ transactionId: pidx });
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = "Booked";
    await booking.save();

    if (booking.busId && booking.selectedSeats.length > 0) {
      await Bus.findByIdAndUpdate(booking.busId, {
        $addToSet: { bookedSeats: { $each: booking.selectedSeats } },
      });
    }

    return res.status(200).json({ message: "Payment verified successfully", status: "Booked" });

  } catch (err) {
    console.error("❌ VERIFY ERROR:", err.message || err);
    return res.status(500).json({ message: "Failed to verify payment", error: err.message });
  }
});

// ✅ HANDLE CALLBACK FROM KHALTI REDIRECT
router.get("/callback", async (req, res) => {
  try {
    const { pidx, status } = req.query;

    console.log("🔍 Payment callback received:", { pidx, status });

    if (!pidx || status !== "Completed") {
      console.error("❌ Invalid callback data received.");
      return res.status(400).json({ error: "Invalid payment details" });
    }

    // ✅ Verify payment with Khalti API
    const lookupRes = await axios.post(KHALTI_LOOKUP_URL, { pidx }, {
      headers: {
        Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Khalti lookup response:", lookupRes.data);

    if (lookupRes.data.status !== "Completed") {
      console.error("❌ Payment verification failed");
      return res.status(400).json({ error: "Payment not verified" });
    }

    // ✅ Find the corresponding booking
    const booking = await Booking.findOne({ transactionId: pidx });

    if (!booking) {
      console.error("❌ Booking not found in the database");
      return res.status(404).json({ error: "Booking not found" });
    }

    // ✅ Update Booking Status to "Booked"
    booking.status = "Booked";
    await booking.save();

    // ✅ Update Bus Seats if bus booking
    if (booking.busId && booking.selectedSeats.length > 0) {
      await Bus.findByIdAndUpdate(booking.busId, {
        $addToSet: { bookedSeats: { $each: booking.selectedSeats } },
      });
    }

    console.log("✅ Booking confirmed, seats updated!");

    // ✅ Redirect to frontend success page
    return res.redirect(`http://localhost:5173/payment/callback?pidx=${pidx}&status=Completed`);

  } catch (err) {
    console.error("❌ Callback error:", err.message || err);
    return res.status(500).json({ error: "Internal server error", details: err.message });
  }
});



// ✅ GET MY BOOKINGS
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
