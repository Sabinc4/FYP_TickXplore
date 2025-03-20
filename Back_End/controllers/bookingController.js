const Bus = require("../models/Bus");
const Vehicle = require("../models/Vehicle");

// ✅ Function to get price based on bus or vehicle selection
const getPrice = async (req, res) => {
    try {
        const { type, id, seats } = req.body;

        let price;
        if (type === "bus") {
            const bus = await Bus.findById(id);
            if (!bus) return res.status(404).json({ success: false, message: "Bus not found" });

            if (seats > bus.remainingSeats) {
                return res.status(400).json({ success: false, message: "Not enough seats available" });
            }

            price = bus.pricePerSeat * seats; // Calculate total price based on selected seats
        } else {
            const vehicle = await Vehicle.findById(id);
            if (!vehicle) return res.status(404).json({ success: false, message: "Vehicle not found" });

            if (!vehicle.isAvailable) {
                return res.status(400).json({ success: false, message: "Vehicle not available" });
            }

            price = vehicle.price; // Fixed price for vehicle rental
        }

        res.json({ success: true, price });
    } catch (error) {
        console.error("Error in get-price:", error);
        res.status(500).json({ success: false, message: "Server error", error });
    }
};

// ✅ Export function
module.exports = { getPrice };
