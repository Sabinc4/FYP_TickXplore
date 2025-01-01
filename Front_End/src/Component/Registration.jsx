import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import registerBackground from '../Pictures/Bus.jpg';

const Registration = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    if (!formData.firstname || !formData.lastname || !formData.email || !formData.password) {
      return 'All fields are required.';
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      return 'Please provide a valid email address.';
    }

    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match.';
    }

    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setSuccess('');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await axios.post('http://localhost:3001/register', {
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        password: formData.password,
      });
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000); // Redirect to login after 2 seconds
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during registration.');
      setSuccess('');
    } finally {
      setLoading(false);
    }
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

            {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
            {success && <p className="text-green-500 mb-4 text-sm">{success}</p>}

            <form onSubmit={handleSubmit} className="space-y-6 w-full">
              {/* First and Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  className="border border-gray-300 py-3 px-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  className="border border-gray-300 py-3 px-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              {/* Email */}
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email Address"
                className="border border-gray-300 py-3 px-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />

              {/* Password */}
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className="border border-gray-300 py-3 px-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />

              {/* Confirm Password */}
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm Password"
                className="border border-gray-300 py-3 px-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />

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
              <button
                type="submit"
                className="w-full bg-slate-900 py-3 text-center text-white rounded-lg hover:bg-purple-600 transition duration-300"
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register Now'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
