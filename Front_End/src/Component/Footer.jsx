import React from 'react';
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-center text-slate-100 dark:bg-neutral-600 dark:text-neutral-100 lg:text-left">
      {/* Footer Content Section */}
      <div className="mx-6 py-10 text-center md:text-left">
        {/* Footer Grid Layout */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {/* Branding Section */}
          <div>
            <h6 className="mb-4 flex items-center justify-center font-semibold uppercase md:justify-start">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="mr-3 h-4 w-4">
                <path d="M12.378 1.602a.75.75 0 00-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03zM21.75 7.93l-9 5.25v9l8.628-5.032a.75.75 0 00.372-.648V7.93zM11.25 22.18v-9l-9-5.25v8.57a.75.75 0 00.372.648l8.628 5.033z" />
              </svg>
              TickXplore
            </h6>
            <p className="text-sm">
              "TickXplore - Your One-Stop Solution for Seamless Ticket Booking.
               Explore Nepal with ease, whether it's buses, tourist spots, or 4x4 rides. Travel Made Simple!"
            </p>
          </div>

          {/* Quick Links Section */}
          <div>
            <h6 className="mb-4 font-semibold uppercase text-center md:text-left">Vehicle Tickets System</h6>
            <ul className="space-y-2">
              <li>
                <a href="/how-to-book" className="text-slate-100 hover:text-blue-500 dark:hover:text-blue-400">
                  How to Book
                </a>
              </li>
              <li>
                <a href="/contact-us" className="text-slate-100 hover:text-blue-500 dark:hover:text-blue-400">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/help-center" className="text-slate-100 hover:text-blue-500 dark:hover:text-blue-400">
                  Help Center
                </a>
              </li>
              <li>
                <a href="/about-us" className="text-slate-100 hover:text-blue-500 dark:hover:text-blue-400">
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Vehicle Bookings Section */}
          <div>
            <h6 className="mb-4 font-semibold uppercase text-center md:text-left">Vehicle Bookings</h6>
            <ul className="space-y-2">
              <li>
                <a href="/4x4-jeeps" className="text-slate-100 hover:text-blue-500 dark:hover:text-blue-400">
                  4x4 Jeeps
                </a>
              </li>
              <li>
                <a href="/scorpio" className="text-slate-100 hover:text-blue-500 dark:hover:text-blue-400">
                  Scorpio
                </a>
              </li>
              <li>
                <a href="/e-vans" className="text-slate-100 hover:text-blue-500 dark:hover:text-blue-400">
                  E-vans
                </a>
              </li>
            </ul>
          </div>

          {/* Miscellaneous Section */}
          <div>
            <h6 className="mb-4 font-semibold uppercase text-center md:text-left">Miscellaneous</h6>
            <ul className="space-y-2">
              <li>
                <a href="/terms-and-conditions" className="text-slate-100 hover:text-blue-500 dark:hover:text-blue-400">
                  Terms and Conditions
                </a>
              </li>
              <li>
                <a href="/blog" className="text-slate-100 hover:text-blue-500 dark:hover:text-blue-400">
                  Blog
                </a>
              </li>
              <li>
                <a href="/register-your-experience" className="text-slate-100 hover:text-blue-500 dark:hover:text-blue-400">
                  Register Your Experience
                </a>
              </li>
              <li>
                <a href="/most-visited-places" className="text-slate-100 hover:text-blue-500 dark:hover:text-blue-400">
                  Most Visited Places
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Social Media Section - Centered */}
      <div className="text-center py-6 bg-slate-800">
        <h6 className="font-semibold uppercase mb-4">Follow Us On</h6>
        <div className="flex justify-center gap-8">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="flex items-center text-slate-100 hover:text-blue-500 dark:hover:text-blue-400">
            <FaFacebook size={25} />
            <span className="ml-2">Facebook</span>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center text-slate-100 hover:text-blue-500 dark:hover:text-blue-400">
            <FaInstagram size={25} />
            <span className="ml-2">Instagram</span>
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex items-center text-slate-100 hover:text-blue-500 dark:hover:text-blue-400">
            <FaLinkedin size={25} />
            <span className="ml-2">LinkedIn</span>
          </a>
        </div>
      </div>

      {/* Footer Bottom Section */}
      <div className="bg-slate-800 text-center p-4 text-slate-300">
        <span>© 2023 TickXplore - All Rights Reserved</span>
      </div>
    </footer>
  );
}
