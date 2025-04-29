const Booking = require("../models/Booking");
const Bus = require("../models/Bus");
const Vehicle = require("../models/Vehicle");
const Vendor = require("../models/Vendor");
const Admin = require("../models/Admin");
const moment = require("moment");
const { sendEmail } = require("../utils/sendEmail");
const Notification = require("../models/Notification");

const refundBooking = async (req, res) => {
  const { bookingId } = req.params;
  const { refundAmount } = req.body;

  // Check if email credentials are loaded from .env
  console.log("Checking EMAIL ENV Vars:");
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded" : "Missing");

  try {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    if (booking.isRefunded) {
      return res.status(400).json({ message: "Refund already processed." });
    }

    if (booking.status !== "Cancelled") {
      return res.status(400).json({ message: "Only cancelled bookings can be refunded." });
    }

    // Update refund status
    booking.isRefunded = true;
    booking.refundAmount = refundAmount;
    booking.refundDate = new Date();
    await booking.save();

    // Identify Vendor
    let vendorEmail = null;
    let vendorId = null;

    if (booking.busId) {
      const bus = await Bus.findById(booking.busId);
      if (bus?.vendorId) {
        const vendor = await Vendor.findById(bus.vendorId);
        if (vendor) {
          vendorEmail = vendor.email;
          vendorId = vendor._id;
        }
      }
    } else if (booking.vehicleId) {
      const vehicle = await Vehicle.findById(booking.vehicleId);
      if (vehicle?.vendorId) {
        const vendor = await Vendor.findById(vehicle.vendorId);
        if (vendor) {
          vendorEmail = vendor.email;
          vendorId = vendor._id;
        }
      }
    }

    // Notify Vendor via Email and Notification
    if (vendorEmail && vendorId) {
      await sendEmail(
        vendorEmail,
        "Refund Processed",
        `<p>A refund of ₹${refundAmount} has been processed for Booking ID: <strong>${booking._id}</strong>.</p>`
      );
      console.log("Email sent to vendor:", vendorEmail);

      // Corrected Notification
      await Notification.create({
        userId: vendorId,
        role: "vendor",
        message: `A refund of ₹${refundAmount} has been processed for your booking: ${booking._id}.`,
      });
    }

    // Notify Admins via Email and Notification
    const admins = await Admin.find({});
    for (let admin of admins) {
      await sendEmail(
        admin.email,
        "Booking Refund Notification",
        `<p>Booking ID: <strong>${booking._id}</strong> has been refunded ₹${refundAmount}.</p>`
      );
      console.log("Email sent to admin:", admin.email);

      await Notification.create({
        userId: admin._id,
        role: "admin",
        message: `Booking ID: ${booking._id} has been refunded ₹${refundAmount}.`,
      });
    }

    res.status(200).json({
      message: "Refund processed and notifications sent.",
      booking,
    });

  } catch (err) {
    console.error("Refund error:", err);
    res.status(500).json({
      message: "Server error while processing refund",
      error: err.message,
    });
  }
};


  const getUpcomingBookings = async (req, res) => {
    try {
      const now = new Date();
  
      const bookings = await Booking.find({
        userId: req.params.userId,
        status: { $in: ["Booked", "CashOnVisit", "Pending"] },
        $or: [
          { takeOffDate: { $gte: now } },
          { reservationDate: { $gte: now } },
        ],
      })
        .populate("busId")
        .populate("vehicleId")
        .sort({ takeOffDate: 1, reservationDate: 1 });
  
      console.log("Fetched bookings for user:", bookings);
      res.status(200).json(bookings);
    } catch (error) {
      console.error("Error fetching upcoming bookings:", error);
      res.status(500).json({ message: "Error fetching upcoming bookings", error });
    }
  };
    

const getBookingHistory = async (req, res) => {
  try {
    const now = moment().toDate();

    const bookings = await Booking.find({
      userId: req.params.userId,
      $or: [
        // Booked trips that are already completed
        {
          status: "Booked",
          $or: [
            { takeOffDate: { $lt: now } },
            { reservationDate: { $lt: now } },
          ],
        },
        {
          status: "Cancelled"
        }
      ]
    })
      .populate("busId")
      .populate("vehicleId")
      .sort({ takeOffDate: -1, reservationDate: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching history", error });
  }
};


const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.status === "Cancelled") {
      return res.status(400).json({ message: "Booking is already cancelled" });
    }

    // Update booking status
    booking.status = "Cancelled";
    await booking.save();

    // Notify User about cancellation via Notification
    await Notification.create({
      userId: booking.userId,
      role: "user",
      message: `Your booking for ${booking.vehicleName || booking.busName} has been cancelled.`,
    });

    // Free the seats if it's a bus booking
    if (booking.busId && booking.selectedSeats && booking.selectedSeats.length > 0) {
      const bus = await Bus.findById(booking.busId);
      if (bus) {
        bus.bookedSeats = bus.bookedSeats.filter(
          (seat) => !booking.selectedSeats.includes(seat)
        );
        await bus.save();
        console.log(`Freed seats: ${booking.selectedSeats.join(", ")} from bus: ${bus.name}`);
      }
    }

    res.status(200).json({ message: "Booking cancelled and seats freed (if applicable)", booking });
  } catch (err) {
    console.error("Cancel error:", err);
    res.status(500).json({ message: "Server error while cancelling booking" });
  }
};
  
  module.exports = {
    getUpcomingBookings,
    getBookingHistory,
    refundBooking,
    cancelBooking,
  };
