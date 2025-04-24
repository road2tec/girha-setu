import { Notification } from "@/types/Notification";
import { IconBell } from "@tabler/icons-react";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const fetchNotifications = async () => {
    try {
      const response = await axios.get("/api/notifications", {
        withCredentials: true,
      });
      console.log(response.data);
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };
  useEffect(() => {
    fetchNotifications();
  }, []);
  return (
    <div className="dropdown dropdown-bottom dropdown-end">
      <div tabIndex={0} role="button" className="btn indicator">
        <span className="indicator-item badge badge-secondary">
          {notifications && notifications.length}
        </span>
        <IconBell size={20} />
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
      >
        {notifications && notifications.length === 0 ? (
          <li className="text-base-content">No new notifications</li>
        ) : (
          notifications &&
          notifications.map((notification: Notification) => (
            <div
              key={notification._id}
              className="text-base-content btn btn-ghost"
            >
              <Link
                href={
                  notification.property
                    ? `property?id=${notification.property._id}`
                    : "#"
                }
              >
                {notification.message} - {notification.property?.type}
              </Link>
            </div>
          ))
        )}
      </ul>
    </div>
  );
};

export default Notification;
