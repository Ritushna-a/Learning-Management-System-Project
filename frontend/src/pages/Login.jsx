import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { loginUserApi } from "../services/api";
import { FiEye, FiEyeOff } from "react-icons/fi";
import logo from "../assets/logo.png";


const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });

  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.emailOrUsername || !formData.password) {
      toast.error("All fields are required");
      return;
    }

    const toastId = toast.loading("Signing in...");
    setLoading(true);
    try {
      const res = await loginUserApi(formData); 
      localStorage.setItem("token", res.data.token);
      toast.success("Logged in successfully!",{ is: toastId});
      navigate("/dashboard");
    } catch (error) {
      toast.error(err?.response?.data?.message || "Login failed", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300 p-5">
          <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-lg">
            <div className="flex justify-center mb-4">
            <img
              src={logo}
              alt="Logo"
              className="h-16 w-auto"
            />
          </div>

            <h2 className="text-2xl font-bold text-center text-gray-900">
          Hello, Welcome Back!
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Login with your credentials.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
          <input
            type="text"
            name="emailOrUsername"
            placeholder="Email or Username"
            value={formData.emailOrUsername}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-400"
          />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
             <input
               type={showPass ? "text" : "password"}
               name="password"
               placeholder="Password"
               value={formData.password}
               onChange={handleChange}
               className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-400"
              />
              <button
               type="button"
               onClick={() => setShowPass((prev) =>!prev)}
               className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
              {showPass ?  <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          <div className="text-right">
              <button
                type="button"
                onClick={() => navigate("/forgotpassword")}
                className="text-sm text-indigo-600 hover:underline">
                Forgot password?
              </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-xl text-lg font-semibold hover:opacity-90 transition"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="text-sm text-gray-800 mt-6 text-center">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-indigo-600 hover:underline cursor-pointer"
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
