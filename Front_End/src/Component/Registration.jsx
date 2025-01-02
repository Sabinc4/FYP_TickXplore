import React, { useState } from 'react';

const Registration = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    alert('Form submitted successfully!');
  };

  return (
    <div className="min-h-screen py-12 bg-white flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-4xl font-bold text-center text-slate-900 mb-6">Create Account</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
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
          >
            Register Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registration;
