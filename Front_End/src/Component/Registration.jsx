import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ExclamationCircleIcon, CheckIcon } from "@heroicons/react/24/outline";

const Registration = () => {
  const [role, setRole] = useState("user");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [vendorLocation, setVendorLocation] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // OTP related states
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [registrationData, setRegistrationData] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    // Validate all required fields
    if (!name || !location || !phoneNumber || !email || !password || !confirmPassword || !role) {
      return setError("All fields are required.");
    }
  
    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }
  
    setIsLoading(true);
  
    // Prepare data based on role
    const data = {
      name,
      location,
      email,
      phoneNumber,
      password,
      confirmPassword,
      role
    };

    if (role === 'vendor') {
      data.vendorName = vendorName;
      data.vendorLocation = vendorLocation;
    }
  
    try {
      const response = await axios.post('http://localhost:3001/users/register', data);
      
      // Save registration data and show OTP modal
      setRegistrationData({
        userId: response.data.user?._id,
        email: response.data.user?.email
      });
      
      setShowOTPModal(true);
      setIsLoading(false);
      
      toast.success("OTP sent to your email. Please verify.");
    } catch (err) {
      setIsLoading(false);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };
  
  const handleOTPVerification = async () => {
    if (!otp || otp.length !== 6) {
      return setOtpError("Please enter a valid 6-digit OTP");
    }
  
    if (!registrationData?.userId) {
      return setOtpError("User ID is missing.");
    }
  
    setIsVerifying(true);
    setOtpError("");
  
    try {
      // Verify OTP with backend
      await axios.post("http://localhost:3001/api/verify-otp", {
        userId: registrationData.userId,
        otp: otp,
      });
  
      // Show success message and navigate to sign-in
      toast.success("Account verified successfully!");
      setTimeout(() => {
        navigate("/sign-in");
      }, 1500); // Small delay to let user see the success message
    } catch (err) {
      setIsVerifying(false);
      if (err.response?.data?.message) {
        setOtpError(err.response.data.message);
      } else {
        setOtpError("OTP verification failed. Please try again.");
      }
    }
  };

  const resendOTP = async () => {
    try {
      await axios.post("http://localhost:3001/api/resend-otp", {
        userId: registrationData.userId,
        email: registrationData.email
      });
      toast.success("New OTP sent successfully!");
    } catch (err) {
      toast.error("Failed to resend OTP. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <ToastContainer position="top-center" autoClose={5000} />

      {/* OTP Verification Modal */}
      {showOTPModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full animate-scale-in">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="mt-3 text-lg font-medium text-gray-900">Verify Your Account</h3>
              <div className="mt-2 text-sm text-gray-500">
                <p>We've sent a 6-digit OTP to {registrationData?.email}. Please enter it below.</p>
              </div>
            </div>

            <div className="mt-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">OTP Code</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  maxLength={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="123456"
                  disabled={isVerifying}
                />
              </div>

              {otpError && (
                <div className="mt-2 p-2 bg-red-50 border-l-4 border-red-500 rounded">
                  <div className="flex items-center">
                    <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                    <p className="ml-2 text-sm text-red-700">{otpError}</p>
                  </div>
                </div>
              )}

              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={resendOTP}
                  className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                >
                  Resend OTP
                </button>

                <button
                  onClick={handleOTPVerification}
                  className={`px-4 py-2 rounded-md text-white ${isVerifying ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                  disabled={isVerifying}
                >
                  {isVerifying ? 'Verifying...' : 'Verify'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Create an Account</h2>
          <p className="mt-2 text-gray-600">Join our platform today</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded">
            <div className="flex items-center">
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="ml-2 text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Full Name*</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="John Doe"
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Location*</label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Your city"
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Phone Number*</label>
            <input
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="1234567890"
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Email*</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="your@email.com"
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Account Type*</label>
            <div className="grid grid-cols-3 gap-3">
              {['user', 'vendor', 'admin'].map((r) => (
                <div
                  key={r}
                  onClick={() => setRole(r)}
                  className={`p-3 border rounded-lg cursor-pointer transition ${role === r ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
                >
                  <div className="text-sm font-medium text-center capitalize">{r}</div>
                </div>
              ))}
            </div>
          </div>

          {role === 'vendor' && (
            <>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Vendor Name*</label>
                <input
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Business name"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Vendor Location*</label>
                <input
                  value={vendorLocation}
                  onChange={(e) => setVendorLocation(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Business address"
                  disabled={isLoading}
                  required
                />
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Password*</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Confirm Password*</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              disabled={isLoading}
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registering...
              </div>
            ) : 'Register Now'}
          </button>
        </form>

        <div className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <button onClick={() => navigate("/sign-in")} className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default Registration;
