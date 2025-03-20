const express = require("express");
const router = express.Router();

// ✅ Example route (Modify as per your payment logic)
router.get("/", (req, res) => {
  res.json({ message: "Payment route is working!" });
});

// ✅ Ensure this export is present
module.exports = router;
