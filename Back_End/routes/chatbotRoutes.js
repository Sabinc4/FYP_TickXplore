const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/ask', async (req, res) => {
  const { message } = req.body;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
        temperature: 0.7
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const aiReply = response.data.choices[0].message.content;

    res.json({
      success: true,
      userMessage: message,
      aiResponse: aiReply,
      raw: response.data, // if you want the full raw response (optional)
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: "AI Chatbot error",
      details: error.response?.data || error.message
    });
  }
});

module.exports = router;
