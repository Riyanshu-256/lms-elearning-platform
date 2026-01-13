import React from "react";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <footer className="w-full border-t bg-white">
      <div
        className="flex flex-col md:flex-row 
        items-center justify-between 
        text-left w-full px-8 md:px-20 py-5"
      >
        {/* Left */}
        <div className="flex items-center gap-3">
          <img className="hidden md:block w-20" src={assets.logo} alt="logo" />

          <div className="hidden md:block h-7 w-px bg-gray-300"></div>

          <p className="text-xs md:text-sm text-gray-500">
            © {new Date().getFullYear()} LMS Project. All Rights Reserved.
          </p>
        </div>

        {/* Right - Social */}
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <a href="#">
            <img
              src={assets.facebook_icon}
              alt="facebook"
              className="w-5 hover:scale-110 transition"
            />
          </a>

          <a href="#">
            <img
              src={assets.twitter_icon}
              alt="twitter"
              className="w-5 hover:scale-110 transition"
            />
          </a>

          <a href="#">
            <img
              src={assets.instagram_icon}
              alt="instagram"
              className="w-5 hover:scale-110 transition"
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
