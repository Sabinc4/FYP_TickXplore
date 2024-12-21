import React, { useState } from "react";
import { FaGoogle } from 'react-icons/fa';

export default function Login() {
  // State management for form inputs and visibility
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({}); // For storing validation errors
  const [loading, setLoading] = useState(false); // For loading state

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Form validation
    const formErrors = {};
    if (!email) formErrors.email = "Email is required";
    if (!password) formErrors.password = "Password is required";

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      setErrors({});
      setLoading(true); // Start loading indicator

      // Simulate successful login (you can integrate API here)
      setTimeout(() => {
        alert('Login successful!');
        setLoading(false); // Stop loading indicator
      }, 1000); // Simulate network delay
    }
  };

  // Handle email and password changes
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) setErrors((prevErrors) => ({ ...prevErrors, email: '' }));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (errors.password) setErrors((prevErrors) => ({ ...prevErrors, password: '' }));
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <section className="h-screen bg-gradient-to-r bg-slate-100 flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-4xl font-bold text-center text-slate-900 mb-6">Sign In</h2>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email"
              className={`w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
          </div>

          {/* Password input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter your password"
                className={`w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-500' : ''}`}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
          </div>

          {/* Remember me checkbox */}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-500"
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <a href="#!" className="text-sm text-blue-500 hover:text-blue-700">
              Forgot password?
            </a>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full py-3 bg-slate-700 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <hr className="flex-1 border-gray-300" />
          <span className="mx-4 text-gray-600">OR</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        {/* Social login buttons */}
        <div className="flex space-x-4">
          {/* Google Button */}
          <a
            href="#!"
            className="flex items-center justify-center w-full py-3 bg-slate-700 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
          >
            <FaGoogle className="mr-2 text-xl text-red-500" /> {/* Google icon with red color */}
            Continue with Google
          </a>
        </div>
        <div className="flex space-x-4 mt-4">
          <a
            href="#!"
            className="flex items-center justify-center w-full py-3 bg-slate-700 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:ring-2 focus:ring-blue-500"
          >
            <span className="mr-2 text-xl"></span>
            Create New Account
          </a>
        </div>
      </div>
    </section>
  );
}
