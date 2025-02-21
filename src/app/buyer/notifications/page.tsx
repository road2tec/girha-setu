"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { IconTrash } from "@tabler/icons-react";
import Link from "next/link";
import { Notification } from "@/types/Notification";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get("/api/notifications", {
        withCredentials: true,
      });
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const deleteNotification = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notification?"))
      return;
    try {
      await axios.delete(`/api/notifications/delete?id=${id}`, {
        withCredentials: true,
      });
      setNotifications(notifications.filter((n) => n._id !== id));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <>
      <h1 className="text-2xl font-bold mb-4 uppercase text-center">
        Notifications
      </h1>
      <div className="border rounded-md p-4">
        {notifications.length > 0 ? (
          notifications.map((n: Notification) => (
            <div
              key={n._id}
              className="p-2 border-b flex justify-between items-center"
            >
              <Link href={n.property ? `property?id=${n.property._id}` : "#"}>
                <p className="text-lg font-semibold">{n.type}</p>
                <p className="text-sm text-base-content">{n.message}</p>
                <p className="text-xs text-base-content">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </Link>
              <button
                onClick={() => deleteNotification(n._id)}
                className="text-red-600 hover:text-red-800"
              >
                <IconTrash />
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">
            No notifications available.
          </p>
        )}
      </div>
    </>
  );
};

export default Notifications;
