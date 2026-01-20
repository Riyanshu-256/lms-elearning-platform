import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserButton, useUser, useAuth, useClerk } from "@clerk/clerk-react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isCourseListPage = pathname.includes("/course-list");

  const { isEducator, setIsEducator } = useContext(AppContext);
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const { getToken } = useAuth();

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const becomeEducator = async () => {
    try {
      if (isEducator) {
        navigate("/educator");
        return;
      }

      const token = await getToken();

      const { data } = await axios.post(
        `${backendUrl}/api/educator/update-role`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setIsEducator(true);
        toast.success(data.message);
        navigate("/educator");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

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
            <button onClick={becomeEducator}>
              {isEducator ? "Educator Dashboard" : "Become Educator"}
            </button>

            <span>|</span>

            <Link to="/my-enrollments">My Enrollments</Link>
          </>
        )}

        {user ? (
          <UserButton />
        ) : (
          <button
            onClick={() => openSignIn()}
            className="bg-blue-600 text-white px-5 py-2 rounded-full"
          >
            Create Account
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
