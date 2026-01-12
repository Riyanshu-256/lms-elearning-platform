import React from "react";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <footer className="bg-gray-900 md:px-36 text-left w-full mt-10">
      {/* Top */}
      <div className="flex flex-col md:flex-row items-start px-8 md:px-0 justify-center gap-10 md:gap-24 py-12 border-b border-white/30">
        {/* Logo + Desc */}
        <div className="flex flex-col md:items-start items-center w-full md:w-1/3 text-center md:text-left">
          <img src={assets.logo_dark} alt="logo" className="w-32 mb-4" />
          <p className="text-gray-400 text-sm leading-relaxed">
            Learn new skills anytime, anywhere with our expert-led courses.
            Build your career and upgrade your knowledge with confidence.
          </p>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-white font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li className="hover:text-white cursor-pointer">Home</li>
            <li className="hover:text-white cursor-pointer">About us</li>
            <li className="hover:text-white cursor-pointer">Career</li>
            <li className="hover:text-white cursor-pointer">Contact</li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-white font-semibold mb-4">Support</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li className="hover:text-white cursor-pointer">Help Center</li>
            <li className="hover:text-white cursor-pointer">
              Terms of Service
            </li>
            <li className="hover:text-white cursor-pointer">Privacy Policy</li>
            <li className="hover:text-white cursor-pointer">Refund Policy</li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="hidden md:flex flex-col items-start w-full md:w-auto">
          <h3 className="font-semibold text-white mb-2">
            Subscribe to our newsletter
          </h3>
          <p className="text-sm text-white/80 mb-4">
            The latest news, articles, and resources, sent to your inbox weekly.
          </p>

          <div className="flex items-center gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="border border-gray-500/30 bg-gray-800 text-gray-300 placeholder-gray-500 outline-none w-64 h-9 rounded px-3 text-sm"
            />
            <button className="bg-blue-600 w-24 h-9 text-white rounded text-sm hover:bg-blue-700 transition">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="py-5 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} LMS Project. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
