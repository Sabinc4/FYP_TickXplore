import React, { useState } from 'react';
import registerBackground from '../Pictures/Bus.jpg';

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setSuccess('');
      return;
    }

    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('firstname', formData.firstname);
      formDataToSubmit.append('lastname', formData.lastname);
      formDataToSubmit.append('email', formData.email);
      formDataToSubmit.append('password', formData.password);
      formDataToSubmit.append('photo', formData.photo);

      const response = await fetch('/api/register', {
        method: 'POST',
        body: formDataToSubmit,
      });

      if (response.ok) {
        setSuccess('Registration successful!');
        setError('');
        setFormData({
          firstname: '',
          lastname: '',
          email: '',
          password: '',
          confirmPassword: '',
          photo: null,
        });
      } else {
        setError('Registration failed. Please try again.');
        setSuccess('');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
      setSuccess('');
    }
  };

  return (
    <div className="min-h-screen py-12 bg-slate-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row w-full lg:w-12/12 bg-white rounded-2xl mx-auto shadow-lg overflow-hidden">
          {/* Left Side: Background */}
          <div
            className="w-full lg:w-1/2 flex items-center justify-center bg-no-repeat bg-cover bg-center"
            style={{ backgroundImage: `url(${registerBackground})` }}
          ></div>

          {/* Right Side: Registration Form */}
          <div className="w-full lg:w-1/2 py-14 px-10 sm:px-16 flex flex-col items-center">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-center">
              Register
            </h2>
            <p className="mb-6 font-bold text-gray-700 text-sm sm:text-base text-center">
              Create your account. It's free and only takes a minute.
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
                  onChange={handleInputChange}
                  placeholder="Firstname"
                  className="border border-gray-900 py-2 px-3 w-full rounded-lg"
                />
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleInputChange}
                  placeholder="Lastname"
                  className="border border-gray-900 py-2 px-3 w-full rounded-lg"
                />
              </div>

              {/* Email */}
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="border border-gray-900 py-2 px-3 w-full rounded-lg"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className="border border-gray-900 py-2 px-3 w-full rounded-lg"
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
                  onChange={handleInputChange}
                  placeholder="Confirm Password"
                  className="border border-gray-900 py-2 px-3 w-full rounded-lg"
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
                <button
                  type="submit"
                  className="w-full bg-slate-900 py-3 text-center text-white rounded-lg hover:bg-purple-600 transition duration-300"
                >
                  Register Now
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
