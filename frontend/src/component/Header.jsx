import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getNotificationsApi,
  markNotificationReadApi,
  markAllNotificationsReadApi
} from "../services/api";

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await getNotificationsApi();
      if (res.data.success) {
        setNotifications(res.data.notifications);
      }
    } catch (error) {
      console.error("Error fetching notifications", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchNotifications();
    }
  }, [token]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleMarkRead = async (id) => {
    try {
      await markNotificationReadApi(id);
      fetchNotifications();
    } catch (error) {
      console.error("Error marking notification read");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsReadApi();
      fetchNotifications();
    } catch (error) {
      console.error("Error marking all as read");
    }
  };

  return (
    <header className="bg-white sticky top-0 z-50 border-b shadow-sm">
      <div className="container mx-auto px-10 py-3 flex items-center justify-between">
        
        <Link to="/" className="flex-shrink-0">
          <img
            src="/src/assets/logo.png"
            alt="Logo"
            className="h-12 w-auto"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-16 absolute left-1/2 -translate-x-1/2">
          <Link
            to="/"
            className="text-[18px] font-semibold text-slate-700 hover:text-indigo-600 transition"
          >
            Home
          </Link>
          <Link
            to="/courses"
            className="text-[18px] font-semibold text-slate-700 hover:text-indigo-600 transition"
          >
            Courses
          </Link>
          <Link
            to="/about"
            className="text-[18px] font-semibold text-slate-700 hover:text-indigo-600 transition"
          >
            About
          </Link>
        </nav>

        <div className="flex items-center gap-6 relative">
          {!token ? (
            <button
              onClick={() => navigate("/login")}
              className="bg-slate-900 text-white text-[16px] font-semibold px-8 py-3 rounded-full hover:bg-slate-800 transition"
            >
              Sign In
            </button>
          ) : (
            <>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative p-3 text-xl text-slate-600 hover:bg-slate-100 rounded-full"
              >
                🔔
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showDropdown && (
                <div className="absolute right-0 top-14 w-80 bg-white shadow-xl rounded-xl border p-4 z-50">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-slate-700">
                      Notifications
                    </h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-sm text-indigo-600 hover:underline"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <p className="text-sm text-slate-500 text-center">
                        No notifications
                      </p>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.notification_id}
                          onClick={() => handleMarkRead(notif.notification_id)}
                          className={`p-3 rounded-lg cursor-pointer transition ${
                            notif.is_read
                              ? "bg-slate-50"
                              : "bg-indigo-50 font-medium"
                          }`}
                        >
                          <p className="text-sm">{notif.message}</p>
                          <p className="text-xs text-slate-400 mt-1">
                            {new Date(notif.createdAt).toLocaleString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
