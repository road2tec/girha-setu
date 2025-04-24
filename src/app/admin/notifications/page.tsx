"use client";

import { useEffect, useState } from "react";
import { BellRing, RefreshCw, Search, Filter, AlertCircle, Mail, User, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";

interface Notification {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt?: string;
}

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<string | null>(null);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/contact");
      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = searchTerm === "" || 
      notification.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto p-8 bg-base-200 min-h-screen">
      {/* Header with title and actions */}
      <div className="bg-base-100 rounded-2xl p-7 mb-8 shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-base-content mb-1">
            Notifications &amp; Messages
          </h1>
          <p className="text-base-content/70">
            View and manage user inquiries and contact messages
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => fetchNotifications()} 
            className="btn btn-circle btn-ghost"
            aria-label="Refresh notifications"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      {/* Filters and search */}
      <div className="bg-base-100 rounded-xl p-5 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={20} className="text-base-content/50" />
            </div>
            <input
              type="text"
              placeholder="Search messages, emails or names..."
              className="input input-bordered w-full pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="btn btn-outline btn-error gap-2"
              >
                Clear Search
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notifications stats summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-base-100 p-5 rounded-xl shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-base-content/70">Total Messages</p>
              <p className="text-2xl font-bold">{notifications.length}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <MessageSquare size={24} className="text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-base-100 p-5 rounded-xl shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-base-content/70">Unique Senders</p>
              <p className="text-2xl font-bold">{new Set(notifications.map(n => n.email)).size}</p>
            </div>
            <div className="p-3 bg-violet-50 rounded-lg">
              <User size={24} className="text-violet-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-base-100 p-5 rounded-xl shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-base-content/70">Search Results</p>
              <p className="text-2xl font-bold">{filteredNotifications.length}</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg">
              <Search size={24} className="text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main content - Messages list */}
      <div className="bg-base-100 rounded-xl shadow-sm overflow-hidden">
        {filteredNotifications.length > 0 ? (
          <div className="divide-y divide-base-200">
            {filteredNotifications.map((notification, index) => (
              <div key={notification._id} className="p-5">
                <div className="flex justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="avatar placeholder">
                      <div className="bg-neutral text-neutral-content rounded-full w-10">
                        <span>{notification.name.charAt(0).toUpperCase()}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium">{notification.name}</h3>
                      <div className="flex items-center text-sm text-base-content/70">
                        <Mail size={14} className="mr-1" />
                        <a href={`mailto:${notification.email}`} className="hover:underline">{notification.email}</a>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-base-content/60">
                    {notification.createdAt ? new Date(notification.createdAt).toLocaleString() : 'Date not available'}
                  </div>
                </div>
                <div className="bg-base-200 p-4 rounded-lg mt-2">
                  <p className="whitespace-pre-wrap text-base-content/80">{notification.message}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <BellRing size={48} className="text-base-content/30 mb-3" />
            <h3 className="text-xl font-medium mb-1">No messages found</h3>
            <p className="text-base-content/60">There are no messages that match your search criteria</p>
          </div>
        )}
        
        <div className="flex justify-between items-center p-4 bg-base-200">
          <div className="text-sm text-base-content/70">
            Showing {filteredNotifications.length} of {notifications.length} messages
          </div>
          <div className="flex gap-2">
            <button className="btn btn-sm btn-ghost">Previous</button>
            <button className="btn btn-sm btn-primary">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
