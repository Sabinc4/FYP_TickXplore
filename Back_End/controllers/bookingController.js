exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "name email") 
      .populate("busId", "name pickupPoint dropPoint")
      .populate("vehicleId", "name price")
      .sort({ createdAt: -1 });

    const formattedBookings = bookings.map(b => ({
      ...b._doc,
      user: b.userId,    
      bus: b.busId,
      vehicle: b.vehicleId
    }));

    res.status(200).json({ bookings: formattedBookings });
  } catch (err) {
    console.error("Admin Bookings Error:", err.message);
    res.status(500).json({ message: "Failed to fetch bookings", error: err.message });
  }
}; 
