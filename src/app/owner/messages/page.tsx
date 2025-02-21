"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthProvider";
import axios from "axios";
import Link from "next/link";
import { User } from "@/types/user";

const Messages = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);

  // 🔹 Fetch Users Who Sent Messages
  useEffect(() => {
    if (!user) return;

    const fetchUsers = async () => {
      const res = await axios.get(`/api/chat/users`);
      setUsers(res.data.users);
    };

    fetchUsers();
  }, [user]);

  return (
    <>
      <h1 className="text-2xl font-bold mb-4 uppercase text-center">
        Messages
      </h1>
      <div className="border rounded-md p-4">
        {users.length > 0 ? (
          users.map((u: User) => (
            <Link
              key={u._id}
              className="p-2 bg-base-200 flex justify-between items-center cursor-pointer hover:bg-base-300"
              href={`messages/${u._id}`}
            >
              <div className="flex items-center gap-3">
                <div className="avatar">
                  <div className="mask mask-squircle h-12 w-12">
                    <img src={u.profilePicture} alt={u.name} />
                  </div>
                </div>
                <div>
                  <div className="font-bold">{u.name}</div>
                  <div className="text-sm opacity-50">{u.address.address}</div>
                </div>
              </div>
              <span className="text-lg">{u.name}</span>
              <span className="text-sm text-gray-500">{u.email}</span>
            </Link>
          ))
        ) : (
          <p>No messages yet.</p>
        )}
      </div>
    </>
  );
};

export default Messages;
