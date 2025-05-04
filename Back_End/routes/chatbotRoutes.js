const express = require("express");
const router = express.Router();
const { chatWithTinyLlama } = require("../controllers/chatbotController");

// POST /api/chatbot
router.post("/", chatWithTinyLlama);

module.exports = router;
