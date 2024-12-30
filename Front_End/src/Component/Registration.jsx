import React, { useState } from 'react';
import registerBackground from '../Pictures/Bus.jpg';
import { Link } from 'react-router-dom';
import axios from 'axios';


const Registration = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    photo: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePhotoChange = (e) => {
    setFormData({
      ...formData,
      photo: e.target.files[0],
    });
  };

  const validateForm = () => {
    if (!formData.firstname || !formData.lastname || !formData.email || !formData.password) {
      return 'All fields are required.';
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      return 'Please provide a valid email address.';
    }

    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;
    if (!strongPasswordRegex.test(formData.password)) {
      return 'Password must include 8-15 characters, at least one uppercase, one lowercase, one number, and one special character.';
    }

    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match.';
    }

    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('',{name,email,password})
    .then (result =>console .log (result))
    .catch (err=> console.log(err))

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setSuccess('');
      return;
    }

    setError('');
    setSuccess('Registration successful! (No API call performed)');
    // Reset form after successful validation
    setFormData({
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      confirmPassword: '',
      photo: null,
    });
  };

  return (
    <div className="min-h-screen py-12 bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row w-full bg-white rounded-2xl mx-auto shadow-lg overflow-hidden">
          {/* Left Side: Background */}
          <div
            className="w-full lg:w-1/2 flex items-center justify-center bg-no-repeat bg-cover bg-center"
            style={{ backgroundImage: `url(${registerBackground})` }}
          ></div>

          {/* Right Side: Registration Form */}
          <div className="w-full lg:w-1/2 py-14 px-8 sm:px-12 flex flex-col items-center space-y-6">
            <h2 className="text-4xl sm:text-5xl font-extrabold mb-4 text-center text-slate-900">
              Create Account
            </h2>
            <p className="mb-4 font-semibold text-gray-700 text-sm sm:text-base text-center">
              Join us to explore more and enjoy seamless ticket bookings.
            </p>

            {/* Error Message */}
            {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

            {/* Success Message */}
            {success && <p className="text-green-500 mb-4 text-sm">{success}</p>}

            <form onSubmit={handleSubmit} className="space-y-6 w-full">
              {/* First and Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={(e)=> setName (e.target.value)}
                  placeholder="First Name"
                  className="border border-gray-300 py-3 px-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={(e)=> setName (e.target.value)}
                  placeholder="Last Name"
                  className="border border-gray-300 py-3 px-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              {/* Email */}
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e)=> setEmail (e.target.value)}
                  placeholder="Email Address"
                  className="border border-gray-300 py-3 px-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={(e)=> setPassword (e.target.value)}
                  placeholder="Password"
                  className="border border-gray-300 py-3 px-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2 text-sm text-gray-600"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              {/* Confirm Password */}
              <div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e)=> setPassword (e.target.value)}
                  placeholder="Confirm Password"
                  className="border border-gray-300 py-3 px-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start gap-x-3">
                <input
                  type="checkbox"
                  className="mt-1 border border-gray-900 rounded"
                  required
                />
                <span className="text-gray-700 text-sm">
                  I accept the{' '}
                  <a href="#" className="text-slate-900 font-semibold">
                    Terms of Use
                  </a>{' '}
                  &{' '}
                  <a href="#" className="text-purple-500 font-semibold">
                    Privacy Policy
                  </a>
                </span>
              </div>

              {/* Submit Button */}
              <div>
                <Link to='/Login'
                  type="submit"
                  className="w-full bg-slate-900 py-3 text-center text-white rounded-lg hover:bg-purple-600 transition duration-300"
                >
                  Register Now
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
