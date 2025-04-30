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

    let rawExtra = paymentData.merchant_extra || req.query.data;
    let metadata;
    if (rawExtra) {
      metadata = typeof rawExtra === "string" ? JSON.parse(rawExtra) : rawExtra;
    } else if (global.khaltiTempStore?.has(purchase_order_id)) {
      metadata = global.khaltiTempStore.get(purchase_order_id);
    } else {
      return res.status(400).json({ error: "Missing metadata in callback" });
    }

    const { type, itemId, userId, seats, takeOffDate, pickupPoint, dropPoint } = metadata;

    const existingBooking = await Booking.findOne({ transactionId: pidx });
    if (existingBooking) {
      return res.redirect(`http://localhost:5173/payment/callback?pidx=${pidx}&status=Completed`);
    }

    let booking;
    const commissionRate = 10;
    let totalPrice = 0;
    let commissionAmount = 0;
    let vendorEarnings = 0;

    if (type === "bus") {
      const bus = await Bus.findById(itemId);
      if (!bus) return res.status(404).json({ error: "Bus not found" });

      totalPrice = bus.pricePerSeat * seats.length;
      commissionAmount = (commissionRate / 100) * totalPrice;
      vendorEarnings = totalPrice - commissionAmount;

      booking = new Booking({
        userId,
        busId: itemId,
        selectedSeats: seats,
        totalPrice,
        commissionAmount,
        vendorEarnings,
        status: "Booked",
        transactionId: pidx,
        takeOffDate: bus.takeOffDate || bus.tripDate || new Date(takeOffDate),
      });

      await booking.save();

      await Bus.findByIdAndUpdate(itemId, {
        $addToSet: { bookedSeats: { $each: seats } },
      });

      const vendor = await Vendor.findById(bus.vendorId);
      if (vendor) {
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
      }

    } else if (type === "vehicle") {
      const vehicle = await Vehicle.findById(itemId);
      if (!vehicle) return res.status(404).json({ error: "Vehicle not found" });

      totalPrice = vehicle.price;
      commissionAmount = (commissionRate / 100) * totalPrice;
      vendorEarnings = totalPrice - commissionAmount;

      booking = new Booking({
        userId,
        vehicleId: itemId,
        totalPrice,
        commissionAmount,
        vendorEarnings,
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
        $inc: {
          totalEarnings: vendorEarnings,
          totalCommission: commissionAmount,
        },
      });

      const vendor = await Vendor.findById(vehicle.vendorId);
      if (vendor) {
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
      }
    } else {
      return res.status(400).json({ error: "Invalid booking type" });
    }

    // Admin Commission Update
    const admin = await Admin.findOne();
    if (admin) {
      admin.totalCommission += commissionAmount;
      await admin.save();

      await Notification.create({
        userId: admin._id,
        role: "admin",
        message: `New ${type} booking of Rs. ${totalPrice}. Commission Rs. ${commissionAmount}`,
      });

      await sendEmail(
        admin.email,
        "New Booking Confirmed - TickXplore",
        `<p>Booking ID: ${booking._id}</p><p>Commission: Rs. ${commissionAmount}</p>`
      );
    }

    // Send to User
    const user = await User.findById(userId);
    if (user && user.email) {
      await sendEmail(
        user.email,
        "Your Booking is Confirmed - TickXplore",
        `<p>Hi ${user.name || "User"}, your booking was successful.</p><p>Total Paid: Rs. ${totalPrice}</p>`
      );

      await Notification.create({
        userId: user._id,
        role: "user",
        message: `Your ${type} booking (Rs. ${totalPrice}) is confirmed.`,
      });
    }

    return res.redirect(`http://localhost:5173/payment/callback?pidx=${pidx}&status=Completed`);
  } catch (err) {
    console.error("❌ Callback error:", err.message || err);
    return res.status(500).json({ error: "Internal server error", details: err.message });
  }
});

router.post("/cash-on-visit", async (req, res) => {
  const { type, itemId, userId, seats, takeOffDate, pickupPoint, dropPoint } = req.body;

  try {
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
        userId,
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

    // ✅ User email + notification
    const user = await User.findById(userId);
    if (user?.email) {
      await sendEmail(
        user.email,
        "Cash on Visit Booking - TickXplore",
        `
        <p>Dear ${user.name || "user"},</p>
        <p>Your booking has been created with <strong>Cash on Visit</strong>.</p>
        <p><strong>Total to Pay:</strong> Rs. ${totalPrice}</p>
        <p>Please complete your payment in person and confirm via our Gmail:</p>
        <p><strong>📧 tickxplore@gmail.com</strong></p>
        <hr />
        <p>Booking ID: ${booking._id}</p>
        `
      );

      await Notification.create({
        userId: new mongoose.Types.ObjectId(userId),
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