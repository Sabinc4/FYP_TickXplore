import React from 'react';
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-center text-slate-100 dark:bg-neutral-600 dark:text-neutral-100 lg:text-left">
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
              <a href="/how-to-book" className="text-slate-100 dark:text-neutral-200 hover:text-blue-500 dark:hover:text-blue-400">How to Book</a>
            </p>
            <p className="mb-4">
              <a href="/contact-us" className="text-slate-100 dark:text-neutral-200 hover:text-blue-500 dark:hover:text-blue-400">Contact Us</a>
            </p>
            <p className="mb-4">
              <a href="/help-center" className="text-neutral-100 dark:text-neutral-200 hover:text-blue-500 dark:hover:text-blue-400">Help Center</a>
            </p>
            <p className="mb-4">
              <a href="/about-us" className="text-neutral-100 dark:text-neutral-200 hover:text-blue-500 dark:hover:text-blue-400">About Us</a>
            </p>
          </div>

          {/* Miscellaneous Section */}
          <div>
            <h6 className="mb-4 flex justify-center font-semibold uppercase md:justify-start">Others</h6>
            <p className="mb-4">
              <a href="/terms-and-conditions" className="text-neutral-100 dark:text-neutral-100 hover:text-blue-500 dark:hover:text-blue-400">Terms and Conditions</a>
            </p>
            <p className="mb-4">
              <a href="/blog" className="text-neutral-100 dark:text-neutral-100 hover:text-blue-500 dark:hover:text-blue-400">Blog</a>
            </p>
            <p className="mb-4">
              <a href="/register-your-experience" className="text-neutral-100 dark:text-neutral-100 hover:text-blue-500 dark:hover:text-blue-400">Register Your Experience</a>
            </p>
            <p className="mb-4">
              <a href="/most-visited-places" className="text-neutral-100 dark:text-neutral-100 hover:text-blue-500 dark:hover:text-blue-400">Most Visited Places</a>
            </p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <h6 className="mb-4 font-semibold uppercase">Follow us on</h6>
            <div className="flex flex-col items-center space-y-4">
              <p className="flex items-center">
                <FaFacebook size={20} className="mr-2 text-blue-100 hover:text-blue-500" />
                <a href="https://facebook.com" className="text-neutral-100 dark:text-neutral-100 hover:text-blue-500 dark:hover:text-blue-400" target="_blank" rel="noopener noreferrer">Facebook</a>
              </p>
              <p className="flex items-center">
                <FaInstagram size={20} className="mr-2 text-blue-100 hover:text-blue-500" />
                <a href="https://instagram.com" className="text-neutral-100 dark:text-neutral-100 hover:text-blue-500 dark:hover:text-blue-400" target="_blank" rel="noopener noreferrer">Instagram</a>
              </p>
              <p className="flex items-center">
                <FaLinkedin size={20} className="mr-2 text-blue-100 hover:text-blue-500" />
                <a href="https://linkedin.com" className="text-neutral-100 dark:text-neutral-100 hover:text-blue-500 dark:hover:text-blue-400" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              </p>
            </div>
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
