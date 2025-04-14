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
      <h1 className="text-3xl font-bold mb-4 uppercase text-center">
        Notifications
      </h1>
      {notifications.length > 0 ? (
        <div className="overflow-x-auto mt-6 bg-base-300">
          <table className="table table-zebra">
            <thead className="bg-base-200 text-base">
              <tr>
                <th>#</th>
                <th>Property Title</th>
                <th>Sqrt FT</th>
                <th>Address</th>
                <th>Message</th>
                <th>Created At</th>
                <th>Action</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((n: Notification, index) => (
                <tr key={n._id}>
                  <td>{index + 1}</td>
                  <td>{n.property.title}</td>
                  <td>{n.property.area} sqft</td>
                  <td>{n.property.location.address}</td>
                  <td>{n.message}</td>
                  <td>{new Date(n.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-error btn-sm"
                      onClick={() => deleteNotification(n._id)}
                    >
                      <IconTrash size={20} />
                    </button>
                  </td>
                  <td>
                    <Link
                      href={`property?id=${n.property._id}`}
                      className="btn btn-primary btn-sm"
                    >
                      View Property
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-base-content/60 text-center text-3xl font-bold">
          No notifications available.
        </p>
      )}
    </>
  );
};

export default Notifications;
