"use client";

import { useEffect, useState } from "react";

interface Notification {
  _id: string;
  name: string;
  email: string;
  message: string;
}
const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/contact");
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, []);
  return (
    <>
      <h1 className="text-3xl font-bold uppercase text-center mb-6">
        User Notifications / Contact Details
      </h1>
      <div className="overflow-x-auto mt-6">
        <table className="table table-zebra">
          <thead className="text-base bg-base-200">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <tr key={notification._id}>
                  <td>{index + 1}</td>
                  <td>{notification.name}</td>
                  <td>{notification.email}</td>
                  <td>{notification.message}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center">
                  No notifications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};
export default NotificationsPage;
