import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { forgotPasswordApi } from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    const toastId = toast.loading("Sending reset link...");
    setLoading(true);

    try {
      await forgotPasswordApi(email);

      toast.success(
        "If this email exists, a reset link has been sent.",
        { id: toastId }
      );

      setEmail("");
    } catch (error) {
      toast.error("Something went wrong. Please try again.", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">

        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-1">
          Forgot your password?
        </h2>

        <p className="text-sm text-gray-600 text-center mb-6">
          A code will be sent to your email to help reset password
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 mb-4 border border-gray-300rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-500 transition disabled:opacity-70">
            {loading ? "Sending..." : "Reset Password"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-700">
          <Link
            to="/login"
            className="inline-flex items-center text-black hover:text-gray-400"
          >
            ← Back to login
          </Link>
        </div>

      </div>
    </div>
  );
}
