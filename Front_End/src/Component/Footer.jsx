import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-neutral-100 text-center text-neutral-600 dark:bg-neutral-600 dark:text-neutral-200 lg:text-left">
      {/* Footer Content Section */}
      <div className="mx-6 py-10 text-center md:text-left">
        {/* Footer Grid Layout */}
        <div className="grid-1 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {/* Branding Section */}
          <div>
            <h6 className="mb-4 flex items-center justify-center font-semibold uppercase md:justify-start">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="mr-3 h-4 w-4">
                <path d="M12.378 1.602a.75.75 0 00-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03zM21.75 7.93l-9 5.25v9l8.628-5.032a.75.75 0 00.372-.648V7.93zM11.25 22.18v-9l-9-5.25v8.57a.75.75 0 00.372.648l8.628 5.033z" />
              </svg>
              TickXplore
            </h6>
            <p>"TickXplore - Your One-Stop Solution for Seamless Ticket Booking.
               Explore Nepal with ease, whether it's buses, tourist spots, or 4x4 rides. Travel Made Simple!"</p>
          </div>

          {/* Quick Links Section */}
          <div>
            <h6 className="mb-4 flex justify-center font-semibold uppercase md:justify-start">Vehicle Tickets System</h6>
            <p className="mb-4">
              <a href="#" className="text-neutral-600 dark:text-neutral-200">How to Book</a>
            </p>
            <p className="mb-4">
              <a href="#" className="text-neutral-600 dark:text-neutral-200">Contact Us</a>
            </p>
            <p className="mb-4">
              <a href="#" className="text-neutral-600 dark:text-neutral-200">Help Center</a>
            </p>
            <p className="mb-4">
              <a href="#" className="text-neutral-600 dark:text-neutral-200">About Us</a>
            </p>
          </div>

          {/* Miscellaneous Section */}
          <div>
            <h6 className="mb-4 flex justify-center font-semibold uppercase md:justify-start">Others</h6>
            <p className="mb-4">
              <a href="#" className="text-neutral-600 dark:text-neutral-200">Terms and Conditions</a>
            </p>
            <p className="mb-4">
              <a href="#" className="text-neutral-600 dark:text-neutral-200">Blog</a>
            </p>
            <p className="mb-4">
              <a href="#" className="text-neutral-600 dark:text-neutral-200">Register Your Experience</a>
            </p>
            <p className="mb-4">
              <a href="#" className="text-neutral-600 dark:text-neutral-200">Most Visited Places</a>
            </p>
          </div>
          {/* Social Media Section */}
          <div>
            <h6 className="mb-4 flex justify-center font-semibold uppercase md:justify-start">Follow us on</h6>
            <p className="mb-4 flex items-center">
              <FaFacebook size={20} className="mr-2 text-blue-600" />
              <a href="#" className="text-neutral-600 dark:text-neutral-200">Facebook</a>
            </p>
            <p className="mb-4 flex items-center">
              <FaInstagram size={20} className="mr-2 text-blue-700" />
              <a href="#" className="text-neutral-600 dark:text-neutral-200">Instagram</a>
            </p>
            <p className="mb-4 flex items-center">
              <FaLinkedin size={20} className="mr-2 text-blue-700" />
              <a href="#" className="text-neutral-600 dark:text-neutral-200">LinkedIn</a>
            </p>
          </div>
        </div>
      </div>

      {/* Footer Bottom Section */}
      <div className="text-center p-4">
        <span>© 2023 Copyright:</span> TickXplore
      </div>
    </footer>
  );
}
