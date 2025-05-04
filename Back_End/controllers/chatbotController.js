const axios = require("axios");
const fs = require("fs");
const path = require("path");

// Load JSON and check for direct match
const getReplyFromJSON = (userMessage) => {
  const dbPath = path.join(__dirname, "../data/tourist-info.json");
  if (!fs.existsSync(dbPath)) return null;

  const data = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

  const exactMatch = data.find(entry =>
    userMessage.toLowerCase() === entry.location.toLowerCase()
  );

  if (exactMatch) return { type: "direct", reply: exactMatch.info };

  const partialMatch = data.filter(entry =>
    userMessage.toLowerCase().includes(entry.location.toLowerCase())
  );

  if (partialMatch.length > 0) {
    const combinedContext = partialMatch.map(e => e.info).join("\n").slice(0, 500);
    return { type: "context", context: combinedContext };
  }

  return null;
};

const cleanReply = (text) => {
  const forbiddenWords = ["AndroidRuntime", "Tlearnment", "Stanford", "card swipe"];
  for (const word of forbiddenWords) {
    if (text.includes(word)) {
      return "Sorry, I may have misunderstood your question. Could you rephrase it?";
    }
  }
  return text;
};

const chatWithTinyLlama = async (req, res) => {
  const rawPrompt = req.body.message;

  const result = getReplyFromJSON(rawPrompt);

  // Case 1: Direct match – reply without using the model
  if (result?.type === "direct") {
    return res.json({ reply: result.reply });
  }

  // Case 2: Use TinyLlama with partial context
  if (result?.type === "context") {
    const fullPrompt = `<|user|>
Please answer the following question strictly based on the given context. Do not use external knowledge.

Question: ${rawPrompt}
Context: ${result.context}
<|assistant|>`;

    try {
      const response = await axios.post(
        "https://api-inference.huggingface.co/models/TinyLlama/TinyLlama-1.1B-Chat-v1.0",
        { inputs: fullPrompt },
        {
          headers: {
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          },
        }
      );

      const rawReply = response.data[0]?.generated_text || "No reply from TinyLlama.";
      const botReply = cleanReply(rawReply);
      return res.json({ reply: botReply });
    } catch (error) {
      console.error("TinyLlama Error:", error?.response?.data || error.message);
      return res.status(500).json({ error: "Failed to fetch TinyLlama response" });
    }
  }

  return res.json({
    reply:
      "Sorry, I couldn't find any information related to your question. Please try asking about tourist places, vehicles, booking, or refunds in TickXplore.",
  });
};

module.exports = { chatWithTinyLlama };
