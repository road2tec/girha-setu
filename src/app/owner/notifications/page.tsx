"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { 
  IconTrash, 
  IconBell, 
  IconHome, 
  IconRuler, 
  IconMapPin, 
  IconCalendar, 
  IconAlertCircle,
  IconLoader2,
  IconMessageCircle
} from "@tabler/icons-react";
import Link from "next/link";
import { Notification } from "@/types/Notification";

// Skeleton loader component
const NotificationsSkeletonLoader = () => {
  return (
    <div className="bg-base-100 rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 animate-pulse space-y-2">
        <div className="h-8 bg-base-200 rounded w-1/4 mb-4"></div>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <th key={i} className="px-4 py-3">
                    <div className="h-4 bg-base-200 rounded"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((row) => (
                <tr key={row}>
                  {[1, 2, 3, 4, 5, 6, 7].map((col) => (
                    <td key={`${row}-${col}`} className="px-4 py-3">
                      <div className="h-4 bg-base-200 rounded w-full"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/notifications", {
        withCredentials: true,
      });
      setNotifications(response.data.notifications);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError("Failed to load notifications. Please try again later.");
      setLoading(false);
    }
  };

  const deleteNotification = async (id: string) => {
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

  if (loading) {
    return (
      <div className="max-w-[1600px] mx-auto p-6 bg-base-200">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-base-content">Notifications</h1>
        </div>
        <NotificationsSkeletonLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1600px] mx-auto p-6 bg-base-200">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-base-content">Notifications</h1>
        </div>
        <div className="bg-base-100 rounded-xl shadow-sm p-8 text-center">
          <IconAlertCircle size={48} className="text-error mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error Loading Notifications</h2>
          <p className="text-base-content/70 mb-6">{error}</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto p-6 bg-base-200">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-base-content flex items-center gap-2">
          <IconBell size={24} className="text-primary" />
          Notifications
        </h1>
        <Link href="/owner/dashboard" className="btn btn-outline btn-sm">
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-base-100 rounded-xl shadow-sm overflow-hidden">
        {notifications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-base-200">
                  <th className="text-xs font-medium text-base-content/70 w-[5%]">#</th>
                  <th className="text-xs font-medium text-base-content/70 w-[15%]">
                    <div className="flex items-center gap-1">
                      <IconHome size={14} />
                      Property
                    </div>
                  </th>
                  <th className="text-xs font-medium text-base-content/70 w-[10%]">
                    <div className="flex items-center gap-1">
                      <IconRuler size={14} />
                      Area
                    </div>
                  </th>
                  <th className="text-xs font-medium text-base-content/70 w-[15%]">
                    <div className="flex items-center gap-1">
                      <IconMapPin size={14} />
                      Location
                    </div>
                  </th>
                  <th className="text-xs font-medium text-base-content/70 w-[25%]">
                    <div className="flex items-center gap-1">
                      <IconMessageCircle size={14} />
                      Message
                    </div>
                  </th>
                  <th className="text-xs font-medium text-base-content/70 w-[10%]">
                    <div className="flex items-center gap-1">
                      <IconCalendar size={14} />
                      Date
                    </div>
                  </th>
                  <th className="text-xs font-medium text-base-content/70 w-[20%]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {notifications.map((notification, index) => (
                  <tr key={notification._id} className="hover:bg-base-200/50 border-b border-base-200">
                    <td className="text-sm text-base-content/70">{index + 1}</td>
                    <td className="text-sm font-medium">{notification.property.title}</td>
                    <td className="text-sm text-base-content/80">{notification.property.area} sqft</td>
                    <td className="text-sm text-base-content/80 truncate max-w-[150px]">{notification.property.location.address}</td>
                    <td className="text-sm">
                      <div className="p-1 bg-base-200/50 rounded-md whitespace-normal">
                        {notification.message}
                      </div>
                    </td>
                    <td className="text-sm text-base-content/80">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          className="btn btn-sm btn-outline btn-error w-full sm:w-auto"
                          onClick={() => deleteNotification(notification._id)}
                          title="Delete notification"
                        >
                          <IconTrash size={16} />
                        </button>
                        <Link
                          href={`/property?id=${notification.property._id}`}
                          className="btn btn-sm btn-outline btn-primary w-full sm:w-auto"
                        >
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <IconBell size={64} className="text-base-content/30 mb-4" />
            <h3 className="text-lg font-semibold text-base-content mb-2">No notifications available</h3>
            <p className="text-base-content/60 text-center max-w-md mb-6">
              You don't have any notifications yet. When there are updates about your properties, they'll appear here.
            </p>
            <Link href="/owner/listings" className="btn btn-primary">
              View My Properties
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
