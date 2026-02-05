import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-white text-black shadow-md">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">

        <Link to="/" className="flex items-center">
          <img
            src="/src/assets/logo.png"
            alt="Logo"
            className="h-10 w-auto"
          />
        </Link>

        <nav className="flex items-center gap-6">
          <Link to="/" className="text-lg hover:text-gray-500">
            Home
          </Link>
          <Link to="/courses" className="text-lg hover:text-gray-500">
            Courses
          </Link>
          <Link to="/about" className="text-lg hover:text-gray-500">
            About
          </Link>
          <Link to="/contact" className="text-lg hover:text-gray-500">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="bg-black text-white font-semibold px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="bg-black text-white font-semibold px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            Sign Up
          </Link>
        </div>

      </div>
    </header>
  );
};

export default Header;
