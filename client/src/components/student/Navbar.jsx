import React from "react";
import { assets } from "../../assets/assets";
import { Link, useLocation } from "react-router-dom";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";

const Navbar = () => {
  const { pathname } = useLocation();
  const isCourseListPage = pathname.includes("/course-list");

  // Clerk auth methods
  const { openSignIn } = useClerk();

  // Current logged-in user
  const { user } = useUser();

  return (
    <div
      className={`flex items-center justify-between px-4 sm:px-10 lg:px-36 border-b border-gray-300 py-4 ${
        isCourseListPage ? "bg-white" : "bg-cyan-100/70"
      }`}
    >
      {/* Logo */}
      <Link to="/">
        <img
          src={assets.logo}
          alt="Logo"
          className="w-28 lg:w-32 cursor-pointer"
        />
      </Link>

      {/* Desktop */}
      <div className="hidden md:flex items-center gap-5 text-gray-600">
        {user && (
          <div>
            <button className="hover:text-blue-600">Become Educator</button> |{" "}
            <Link to="/my-enrollments" className="hover:text-blue-600">
              My Enrollments
            </Link>
          </div>
        )}

        {/* Auth */}
        {user ? (
          <UserButton />
        ) : (
          <button
            onClick={() => openSignIn()}
            className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition"
          >
            Create Account
          </button>
        )}
      </div>

      {/* Mobile */}
      <div className="md:hidden flex items-center gap-3 text-gray-600">
        {user ? (
          <UserButton />
        ) : (
          <button onClick={() => openSignIn()}>
            <img src={assets.user_icon} alt="user" className="w-8" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
