import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaBook,
  FaPlusCircle,
  FaUsers,
  FaClipboardList,
  FaSignOutAlt
} from "react-icons/fa";
import { getUser, logout } from "../protected/Auth"; 
import logo from "../assets/logo.png"; 

const InstructorDashCard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(getUser() || { username: "Instructor", email: "" });

  useEffect(() => {
    const handleUpdate = () => setUser(getUser() || { username: "Instructor", email: "" });
    window.addEventListener("userUpdated", handleUpdate);
    return () => window.removeEventListener("userUpdated", handleUpdate);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => (location.pathname === path ? "bg-black text-white" : "hover:bg-gray-100");

  return (
    <div className="w-72 bg-white rounded-lg shadow-md min-h-[600px] flex flex-col justify-between p-5">
      <div>
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="h-10 object-contain" />
        </div>

        <div className="flex flex-col gap-2">
          <Link
            to="/mycourses"
            className={`flex items-center gap-3 p-2 rounded ${isActive("/mycourses")}`}
          >
            <FaBook /> My Courses
          </Link>
          <Link
            to="/createcourse"
            className={`flex items-center gap-3 p-2 rounded ${isActive("/createcourse")}`}
          >
            <FaPlusCircle /> Create Course
          </Link>
          <Link
            to="/assignments"
            className={`flex items-center gap-3 p-2 rounded ${isActive("/assignments")}`}
          >
            <FaClipboardList /> Assignments
          </Link>
          <Link
            to="/createassignment"
            className={`flex items-center gap-3 p-2 rounded ${isActive("/createassignment")}`}
          >
            <FaPlusCircle /> Create Assignment
          </Link>
          <Link
            to="/students"
            className={`flex items-center gap-3 p-2 rounded ${isActive("/students")}`}
          >
            <FaUsers /> Students
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
        <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-semibold">
          {user?.username?.charAt(0)?.toUpperCase() || "I"}
        </div>
        <div>
          <p className="font-medium text-sm">{user?.username || "Instructor"}</p>
          <p className="text-xs text-gray-500">{user?.role || "Instructor"}</p>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashCard;
