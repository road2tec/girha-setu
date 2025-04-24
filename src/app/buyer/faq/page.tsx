"use client";
import { useAuth } from "@/context/AuthProvider";
import { useState } from "react";

const FAQPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      role: "bot",
      content: "Hi! How can I help you with your flat listing today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/gemini-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, history: newMessages }),
      });

      const data = await res.json();
      setMessages([...newMessages, { role: "bot", content: data.reply }]);
    } catch (err) {
      setMessages([
        ...newMessages,
        { role: "bot", content: "Oops! Something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <h1 className="text-4xl font-bold uppercase text-center mb-8">
        Chat with our Assistant
      </h1>

      <div className="max-w-3xl mx-auto space-y-6 h-96 overflow-y-auto p-4 border border-gray-300 rounded-lg shadow-md">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chat ${
              msg.role === "user" ? "chat-end" : "chat-start"
            }`}
          >
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img
                  alt={msg.role}
                  src={
                    msg.role === "user"
                      ? user.profilePicture
                      : "https://img.icons8.com/color/96/bot.png"
                  }
                />
              </div>
            </div>
            <div
              className={`chat-bubble ${
                msg.role === "bot" ? "bg-primary text-white" : ""
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>
      {/* Input box */}
      <div className="flex items-center gap-2 pt-4 max-w-3xl mx-auto mt-4">
        <textarea
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your question..."
          className="textarea textarea-bordered flex-1 resize-none"
        />
        <button
          onClick={sendMessage}
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </>
  );
};

export default FAQPage;
