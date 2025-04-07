const Booking = require("../models/Booking");
const Bus = require("../models/Bus");
const Vehicle = require("../models/Vehicle");
const Vendor = require("../models/Vendor");
const Admin = require("../models/Admin");
const { sendEmail } = require("../utils/sendEmail");

const refundBooking = async (req, res) => {
    const { bookingId } = req.params;
    const { refundAmount } = req.body;
  
    // ✅ Check if email credentials are loaded from .env
    console.log("🔍 Checking EMAIL ENV Vars:");
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded ✅" : "Missing ❌");
  
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
  
      // Notify Vendor
      let vendorEmail = null;
  
      if (booking.busId) {
        const bus = await Bus.findById(booking.busId);
        if (bus?.vendorId) {
          const vendor = await Vendor.findById(bus.vendorId);
          if (vendor) vendorEmail = vendor.email;
        }
      } else if (booking.vehicleId) {
        const vehicle = await Vehicle.findById(booking.vehicleId);
        if (vehicle?.vendorId) {
          const vendor = await Vendor.findById(vehicle.vendorId);
          if (vendor) vendorEmail = vendor.email;
        }
      }
  
      if (vendorEmail) {
        await sendEmail(
          vendorEmail,
          "Refund Processed",
          `<p>A refund of ₹${refundAmount} has been processed for Booking ID: <strong>${booking._id}</strong>.</p>`
        );
        console.log("✅ Email sent to vendor:", vendorEmail);
      }
  
      // Notify Admins
      const admins = await Admin.find({});
      for (let admin of admins) {
        await sendEmail(
          admin.email,
          "Booking Refund Notification",
          `<p>Booking ID: <strong>${booking._id}</strong> has been refunded ₹${refundAmount}.</p>`
        );
        console.log("✅ Email sent to admin:", admin.email);
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
  
// Optional route to fetch upcoming eligible bookings
const getUpcomingBookings = async (req, res) => {
  const { userId } = req.params;
  const today = new Date();

  try {
    const bookings = await Booking.find({
      userId,
      takeOffDate: { $gt: today },
      status: "Booked",
      isRefunded: false,
    }).sort({ takeOffDate: 1 });

    res.json({ bookings });
  } catch (error) {
    console.error("Error fetching upcoming bookings:", error);
    res.status(500).json({ message: "Server error while fetching bookings" });
  }
};

const cancelBooking = async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.bookingId);
      if (!booking) return res.status(404).json({ message: "Booking not found" });
  
      if (booking.status === "Cancelled") {
        return res.status(400).json({ message: "Booking is already cancelled" });
      }
  
      booking.status = "Cancelled";
      await booking.save();
  
      res.status(200).json({ message: "Booking cancelled successfully", booking });
    } catch (err) {
      console.error("Cancel error:", err);
      res.status(500).json({ message: "Server error while cancelling booking" });
    }
  };
  
  module.exports = {
    refundBooking,
    getUpcomingBookings,
    cancelBooking,
  };
