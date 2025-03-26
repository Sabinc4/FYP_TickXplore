import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiEye, FiEyeOff, FiMail, FiLock, FiArrowRight, FiUser } from "react-icons/fi";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showResetOtpModal, setShowResetOtpModal] = useState(false);
  const [userId, setUserId] = useState(null);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [selectedRole, setSelectedRole] = useState("user");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      toast.error("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/auth/sign-in", {
        email,
        password,
      });

      if (
        response.data?.requireOTP === true ||
        response.data?.message?.toLowerCase()?.includes("verify your otp")
      ) {
        const resolvedUserId = response.data.userId || response.data.user?._id;
        if (!resolvedUserId) {
          toast.error("User ID missing for OTP verification");
          setLoading(false);
          return;
        }

        localStorage.setItem("pendingUserId", resolvedUserId);
        setUserId(resolvedUserId);
        setShowOtpModal(true);
        toast.success("OTP sent to your email!");
      }
      else if (response.data?.message?.toLowerCase().includes("not active")) {
        toast.error(
          "Your vendor account is not active. Please wait for admin approval."
        );
        setLoading(false); 
        return; 
      }      
      else if (response.data?.token) {
        handleLoginSuccess(response.data);
      }
      else {
        toast.error("Unexpected response from server");
      }
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage =
        err.response?.data?.message ||
        (err.response?.status === 401
          ? "Invalid email or password"
          : "Login failed. Please try again.");
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const resolvedUserId = userId || localStorage.getItem("pendingUserId");
    if (!resolvedUserId) {
      toast.error("User ID is missing. Please login again.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/auth/verify-otp",
        { email, otp, userId: resolvedUserId }
      );

      if (response.data?.token) {
        handleLoginSuccess(response.data);
        setShowOtpModal(false);
        setOtp("");
        localStorage.removeItem("pendingUserId");
      } else {
        toast.error("OTP verification failed");
      }
    } catch (err) {
      console.error("OTP Verification Failed:", err);
      toast.error(
        err.response?.data?.message || "Invalid OTP. Please try again."
      );
      setOtp("");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!resetEmail) {
      toast.error("Please enter your email address");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3001/auth/forgot-password/${selectedRole}`,
        { email: resetEmail }
      );

      if (response.data.success) {
        setShowResetOtpModal(true);
        toast.success("OTP sent to your email!");
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      const errorMsg = err.response?.data?.message || 
                      err.response?.data?.error ||
                      "Failed to send OTP. Please try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleResetOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3001/auth/verify-reset-otp",
        {
          email: resetEmail,
          otp,
          role: selectedRole
        }
      );

      if (response.data.success) {
        setShowResetOtpModal(false);
        setResetSent(true);
        toast.success("OTP verified successfully!");
      }
    } catch (err) {
      console.error("OTP Verification Failed:", err);
      toast.error(
        err.response?.data?.message || "Invalid OTP. Please try again."
      );
      setOtp("");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/auth/reset-password",
        {
          email: resetEmail,
          newPassword,
          role: selectedRole
        }
      );

      if (response.data.success) {
        toast.success("Password reset successfully!");
        setForgotPasswordMode(false);
        setResetSent(false);
      }
    } catch (err) {
      console.error("Password reset error:", err);
      toast.error(
        err.response?.data?.message || "Password reset failed. Please try again."
      );
    }
  };

  const handleLoginSuccess = (data) => {
    const { token, user } = data;
    if (!user?.role) {
      toast.error("Invalid user data received");
      return;
    }

    localStorage.setItem("token", token);
    localStorage.setItem("userRole", user.role);
    localStorage.setItem("userLoggedIn", "true");
    localStorage.setItem("userName", user.name);

    const idKey = user.role === "admin" ? "adminId" :
                 user.role === "vendor" ? "vendorId" : "userId";
    localStorage.setItem(idKey, user._id);

    window.dispatchEvent(new Event("storageUpdate"));

    const redirectPath = user.role === "admin" ? "/Admin_Dashboard" :
                        user.role === "vendor" ? "/Vendor_Dashboard" : "/";
    navigate(redirectPath);
    toast.success("Login successful!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <ToastContainer position="top-center" autoClose={5000} />

      {/* Login OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Verify Your Email</h3>
              <p className="text-gray-600 mt-2">We've sent a 6-digit code to {email}</p>
            </div>

            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div className="flex justify-center">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="000000"
                  className="w-64 p-4 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl font-mono tracking-widest"
                  maxLength="6"
                  required
                  autoFocus
                />
              </div>

              <div className="flex flex-col space-y-4">
                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className={`w-full py-3 px-4 rounded-lg text-white font-semibold shadow-md transition-colors ${
                    loading || otp.length !== 6 ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {loading ? "Verifying..." : "Verify Code"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowOtpModal(false)}
                  className="py-2 px-4 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Reset OTP Modal */}
      {showResetOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Verify OTP</h3>
              <p className="text-gray-600 mt-2">Enter the OTP sent to {resetEmail}</p>
            </div>

            <form onSubmit={handleResetOtpSubmit} className="space-y-6">
              <div className="flex justify-center">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="000000"
                  className="w-64 p-4 border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl font-mono tracking-widest"
                  maxLength="6"
                  required
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Verify OTP
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main Card */}
      <div className={`w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden ${
        showOtpModal || showResetOtpModal ? "blur-sm" : ""
      }`}>
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {forgotPasswordMode
                ? resetSent
                  ? "Reset Password"
                  : "Forgot Password"
                : "Welcome Back"}
            </h1>
            <p className="text-gray-600">
              {forgotPasswordMode
                ? resetSent
                  ? "Enter your new password"
                  : "Enter your email to reset password"
                : "Sign in to continue"}
            </p>
          </div>

          {forgotPasswordMode ? (
            resetSent ? (
              <form onSubmit={handlePasswordReset} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-3 border rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-3 border rounded-lg"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Reset Password
                </button>
              </form>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["user", "vendor", "admin"].map((role) => (
                      <button
                        type="button"
                        key={role}
                        onClick={() => setSelectedRole(role)}
                        className={`py-2 px-3 rounded-lg text-sm font-medium ${
                          selectedRole === role
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                      <FiMail className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full pl-10 pr-3 py-3 border rounded-lg"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Send OTP
                </button>

                <button
                  type="button"
                  onClick={() => setForgotPasswordMode(false)}
                  className="w-full py-2 text-gray-600 hover:text-gray-800"
                >
                  Back to Login
                </button>
              </form>
            )
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <FiMail className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 border rounded-lg"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <FiLock className="text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 border rounded-lg"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>

              <button
                type="button"
                onClick={() => setForgotPasswordMode(true)}
                className="w-full text-blue-600 hover:underline"
              >
                Forgot Password?
              </button>

              <div className="text-center pt-4 border-t border-gray-200">
                <NavLink
                  to="/signup"
                  className="text-blue-600 hover:underline"
                >
                  Don't have an account? Sign Up
                </NavLink>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}