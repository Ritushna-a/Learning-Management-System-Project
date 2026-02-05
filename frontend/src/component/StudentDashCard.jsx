import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaBookOpen,
  FaClipboardList,
  FaUser,
  FaSignOutAlt
} from "react-icons/fa";
import { getUser, logout } from "../protected/Auth";
import logo from "../assets/logo.png";

const StudentDashCard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const user = getUser() || {};

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) =>
    location.pathname === path
      ? "bg-black text-white"
      : "hover:bg-gray-100";

  return (
    <div className="w-72 bg-white rounded-lg shadow-md min-h-[600px] flex flex-col justify-between p-5">

      <div>
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Learnex Logo" className="h-10 object-contain" />
        </div>

        <div className="flex flex-col gap-2">
          <Link
            to="/studentdashboard"
            className={`flex items-center gap-3 p-2 rounded ${isActive("/studentdashboard")}`}
          >
            <FaHome /> Dashboard
          </Link>

          <Link
            to="/courses"
            className={`flex items-center gap-3 p-2 rounded ${isActive("/courses")}`}
          >
            <FaBookOpen /> Courses
          </Link>

          <Link
            to="/assignments"
            className={`flex items-center gap-3 p-2 rounded ${isActive("/assignments")}`}
          >
            <FaClipboardList /> Assignments
          </Link>

          <Link
            to="/profile"
            className={`flex items-center gap-3 p-2 rounded ${isActive("/profile")}`}
          >
            <FaUser /> Profile
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-2 rounded hover:bg-gray-100 text-red-500"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>
      <div className="border-t pt-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          {user?.profilePicture ? (
            <img
              src={
                user.profilePicture.startsWith("http")
                  ? user.profilePicture
                  : `${import.meta.env.VITE_API_BASE_URL}${user.profilePicture}`
              }
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white font-semibold">
              {user?.name?.charAt(0)?.toUpperCase() || "S"}
            </span>
          )}
        </div>
        <div className="flex flex-col">
          <p className="font-medium text-sm">{user?.username || "Student"}</p>
          <p className="text-xs text-gray-500">{user?.role || "Student"}</p>
        </div>
      </div>
    </div>
  );
};

export default StudentDashCard;
