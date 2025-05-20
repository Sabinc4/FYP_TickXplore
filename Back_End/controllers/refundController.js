const Booking = require("../models/Booking");
const Bus = require("../models/Bus");
const Vehicle = require("../models/Vehicle");
const Vendor = require("../models/Vendor");
const Admin = require("../models/Admin");
const moment = require("moment");
const { sendEmail } = require("../utils/sendEmail");
const Notification = require("../models/Notification");
const RefundRequest = require("../models/RefundRequest");

const refundBooking = async (req, res) => {
  const { bookingId } = req.params;
  const { refundAmount } = req.body;

  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded" : "Missing");

  try {
    // 1. Fetch the booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    // 2. Check if already refunded
    if (booking.isRefunded) {
      return res.status(400).json({ message: "Refund already processed." });
    }

    // 3. Refund allowed only if cancelled
    if (booking.status !== "Cancelled") {
      return res.status(400).json({ message: "Only cancelled bookings can be refunded." });
    }

    // 4. Update booking refund status
    booking.isRefunded = true;
    booking.refundAmount = refundAmount;
    booking.refundDate = new Date();
    await booking.save();

    // 5. Identify vendor (bus or vehicle)
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

    // 6. Notify Vendor
    if (vendorEmail && vendorId) {
      await sendEmail(
        vendorEmail,
        "Refund Processed",
        `<p>A refund of ₹${refundAmount} has been processed for Booking ID: <strong>${booking._id}</strong>.</p>`
      );

      await Notification.create({
        userId: vendorId,
        role: "vendor",
        message: `A refund of ₹${refundAmount} has been processed for your booking: ${booking._id}.`,
      });
    }

    // 7. Notify Admins
    const admins = await Admin.find({});
    for (let admin of admins) {
      await sendEmail(
        admin.email,
        "Booking Refund Notification",
        `<p>Booking ID: <strong>${booking._id}</strong> has been refunded ₹${refundAmount}.</p>`
      );

      await Notification.create({
        userId: admin._id,
        role: "admin",
        message: `Booking ID: ${booking._id} has been refunded ₹${refundAmount}.`,
      });
    }

    // 8. (Optional) Notify User who requested refund
    const user = await User.findById(booking.userId);
    if (user) {
      await sendEmail(
        user.email,
        "Refund Approved",
        `<p>Your refund of ₹${refundAmount} for booking ID <strong>${booking._id}</strong> has been approved and processed.</p>`
      );

      await Notification.create({
        userId: user._id,
        role: "user",
        message: `Your refund of ₹${refundAmount} for booking ID ${booking._id} has been approved.`,
      });
    }

    // 9. Return success
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


const requestRefund = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { refundAmount, reason } = req.body;
    const userId = req.user._id;

    if (!reason || !refundAmount || isNaN(refundAmount)) {
      return res.status(400).json({ message: "Missing or invalid refund data." });
    }

    const existingRequest = await RefundRequest.findOne({ bookingId, userId, status: "Pending" });
    if (existingRequest) {
      return res.status(400).json({ message: "Refund request already submitted." });
    }

    const refund = new RefundRequest({
      bookingId,
      userId,
      refundAmount,
      reason,
      status: "Pending",
      createdAt: new Date()
    });

    await refund.save();
    res.status(201).json({ message: "Refund request submitted successfully." });
  } catch (error) {
    console.error("Refund request error:", error);
    res.status(500).json({ message: "Server error while requesting refund." });
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

const getRefundRequests = async (req, res) => {
  try {
    const requests = await RefundRequest.find({ status: "Pending" })
      .populate("bookingId")
      .populate("userId");

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching refund requests", error });
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

const getBookingsByVendor = async (req, res) => {
  try {
    const { vendorId } = req.query;

    if (!vendorId) {
      return res.status(400).json({ message: "vendorId is required" });
    }

    const bookings = await Booking.find({
      $or: [
        { busId: { $exists: true }, vendorId },
        { vehicleId: { $exists: true }, vendorId },
      ],
    }).populate("userId busId vehicleId");

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Error fetching vendor bookings:", error);
    res.status(500).json({ message: "Error fetching vendor bookings", error });
  }
};

const processRefundRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;

    const refund = await RefundRequest.findById(id).populate("bookingId");
    if (!refund) return res.status(404).json({ message: "Refund request not found." });

    if (refund.status !== "Pending") {
      return res.status(400).json({ message: "Refund request already processed." });
    }

    refund.status = action === "approve" ? "Approved" : "Rejected";
    refund.processedAt = new Date();
    await refund.save();

    if (action === "approve") {
      // Cancel the booking
      const booking = await Booking.findById(refund.bookingId._id);
      if (!booking) return res.status(404).json({ message: "Booking not found." });

      booking.status = "Cancelled";
      await booking.save();

      return res.status(200).json({ message: "Refund approved and booking cancelled." });
    } else {
      return res.status(200).json({ message: "Refund request rejected." });
    }

  } catch (error) {
    console.error("Process Refund Error:", error);
    res.status(500).json({ message: "Server error while processing refund" });
  }
};


const getMyBookings = async (req, res) => {
  try {
    const userId = req.params.userId;

    const bookings = await Booking.find({
      
      userId,
      status: "Booked", //
    })
    .populate("busId vehicleId")
    .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Error fetching my bookings:", error);
    res.status(500).json({ message: "Error fetching my bookings", error });
  }
};

module.exports = {
  getUpcomingBookings,
  getBookingHistory,
  refundBooking,
  cancelBooking,
  getMyBookings,
  getBookingsByVendor,
  requestRefund,           
  getRefundRequests,       
  processRefundRequest,    
};