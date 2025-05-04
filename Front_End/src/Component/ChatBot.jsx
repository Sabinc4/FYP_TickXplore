import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaPaperPlane, FaCommentDots, FaTimes } from "react-icons/fa";
import { BeatLoader } from "react-spinners"; // Spinner package

const ChatBot = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const handleSend = async () => {
    if (!userInput.trim()) return;

    const userMessage = { from: "user", text: userInput };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:3001/api/chatbot", {
        message: userInput,
      });

      const botMessage = { from: "bot", text: res.data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Sorry, something went wrong." },
      ]);
    }

    setUserInput("");
    setIsLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 bg-[#333333] text-white p-3 rounded-full shadow-lg z-50 hover:bg-[#555]"
      >
        {isOpen ? <FaTimes size={18} /> : <FaCommentDots size={20} />}
      </button>

      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-[350px] max-h-[500px] bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col overflow-hidden z-50">
          <div className="bg-[#E1F4F3] p-4 text-center font-semibold text-lg text-gray-800 border-b">
            TickXplore ChatBot
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[80%] px-4 py-2 rounded-xl text-sm ${
                  msg.from === "user"
                    ? "bg-blue-500 text-white self-end ml-auto"
                    : "bg-gray-200 text-gray-800 self-start mr-auto"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-center py-2">
                <BeatLoader size={6} color="#888" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex items-center border-t px-3 py-2 gap-2 bg-white">
            <input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
              type="text"
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 border rounded-xl outline-none text-sm"
            />
            <button
              onClick={handleSend}
              disabled={isLoading}
              className={`p-2 rounded-full ${
                isLoading ? "bg-gray-300" : "bg-[#333333] hover:bg-[#555]"
              } text-white`}
            >
              <FaPaperPlane size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
