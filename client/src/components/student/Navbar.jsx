import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { AppContext } from "../../context/AppContext";

const Navbar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isCourseListPage = pathname.includes("/course-list");

  const { isEducator } = useContext(AppContext);
  const { openSignIn } = useClerk();
  const { user } = useUser();

  return (
    <div
      className={`flex items-center justify-between px-4 sm:px-10 lg:px-36 border-b border-gray-300 py-4 ${
        isCourseListPage ? "bg-white" : "bg-cyan-100/70"
      }`}
    >
      {/* Logo */}
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="Logo"
        className="w-28 lg:w-32 cursor-pointer"
      />

      {/* Desktop */}
      <div className="hidden md:flex items-center gap-5 text-gray-600">
        {user && (
          <>
            <button
              onClick={() => navigate("/educator")}
              className="hover:text-blue-600"
            >
              {isEducator ? "Educator Dashboard" : "Become Educator"}
            </button>

            <span>|</span>

            <Link to="/my-enrollments" className="hover:text-blue-600">
              My Enrollments
            </Link>
          </>
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
          <>
            <button
              onClick={() => navigate("/educator")}
              className="hover:text-blue-600 text-sm"
            >
              {isEducator ? "Dashboard" : "Educator"}
            </button>

            <Link to="/my-enrollments" className="hover:text-blue-600 text-sm">
              Enrollments
            </Link>

            <UserButton />
          </>
        ) : (
          <button
            onClick={() => openSignIn()}
            className="bg-blue-600 text-white px-4 py-1.5 text-sm rounded-full"
          >
            Sign In
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
