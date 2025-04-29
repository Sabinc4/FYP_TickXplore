import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FaRobot, FaPaperPlane, FaSpinner } from "react-icons/fa";

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! I'm TickXplore chatbot. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = { sender: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:3001/api/chatbot/ask", {
        message: input,
      });

      setMessages(prev => [
        ...prev,
        { sender: "bot", text: res.data.reply }
      ]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "Sorry, I encountered an error. Please try again later." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="w-80 bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
          <div 
            className="bg-blue-600 text-white p-3 flex justify-between items-center cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            <div className="flex items-center gap-2">
              <FaRobot className="text-lg" />
              <span className="font-bold">TickXplore Assistant</span>
            </div>
            <span className="text-sm">▲</span>
          </div>
          
          <div className="h-80 bg-gray-50 p-3 overflow-y-auto">
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={`mb-3 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div 
                  className={`max-w-xs p-3 rounded-lg ${msg.sender === "user" 
                    ? "bg-blue-500 text-white rounded-br-none" 
                    : "bg-gray-200 text-gray-800 rounded-bl-none"}`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-3">
                <div className="bg-gray-200 text-gray-800 p-3 rounded-lg rounded-bl-none">
                  <FaSpinner className="animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-3 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Type your message..."
                disabled={isLoading}
              />
              <button 
                onClick={sendMessage} 
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-10 h-10 flex items-center justify-center disabled:opacity-50"
              >
                {isLoading ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center"
        >
          <FaRobot className="text-2xl" />
        </button>
      )}
    </div>
  );
};

export default ChatBot;