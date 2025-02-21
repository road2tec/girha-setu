"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthProvider";
import axios from "axios";
import { ObjectId } from "mongoose";
import { User } from "@/types/user";

interface Message {
  _id: ObjectId;
  sender: string;
  content: string;
}

const Chat = () => {
  const { user } = useAuth();
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [owner, setOwner] = useState<User | null>(null);

  useEffect(() => {
    if (!user) return;

    const startChat = async () => {
      const url = window.location.href;
      const ownerId = url.split("/").pop();
      const owner = await axios.post(`/api/users/getUser`, {
        userId: ownerId,
      });
      setOwner(owner.data.user);
      const res = await axios.post("/api/chat", { userId: user._id, ownerId });
      setChatId(res.data.chat);
      setMessages(res.data.message);
    };
    startChat();
  }, [user]);

  const sendMessage = async () => {
    if (!message.trim() || !chatId) return;

    const res = await axios.put("/api/chat/send-message", {
      chatId,
      senderId: user?._id,
      content: message,
    });
    setMessages(res.data.message);
    setMessage("");
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2 uppercase text-center">
        Chat with {owner?.name}
      </h2>
      <div className="min-h-[calc(100vh-20rem)] bg-base-300 rounded-lg overflow-y-auto border p-2">
        {messages.map((msg: Message, index) => (
          <div
            key={index}
            className={`chat ${
              msg.sender === user._id ? "chat-start" : "chat-end"
            }`}
          >
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="avatar"
                  src={
                    msg.sender === user._id
                      ? user?.profilePicture
                      : owner?.profilePicture
                  }
                />
              </div>
            </div>
            <div className="chat-bubble">{msg.content}</div>
          </div>
        ))}
      </div>
      <form
        className="flex mt-2"
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
      >
        <input
          type="text"
          className="input input-bordered w-full"
          value={message}
          placeholder="Type a message..."
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit" className="btn btn-primary rounded-md ml-2">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
