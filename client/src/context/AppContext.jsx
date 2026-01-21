// Import hooks from React
import { createContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import { useAuth, useUser } from "@clerk/clerk-react";
import { toast } from "react-toastify";

// Create global context
export const AppContext = createContext();

// Context Provider
export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  const { getToken } = useAuth();
  const { user } = useUser();

  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userData, setUserData] = useState(null);

  // ================= FETCH ALL COURSES =================
  const fetchAllCourses = useCallback(async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/course/all`);

      if (data.success) {
        setAllCourses(data.courses || []);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }, [backendUrl]);

  // ================= FETCH USER DATA =================
  const fetchUserData = useCallback(async () => {
    try {
      if (!user) return;

      if (user.publicMetadata?.role === "educator") {
        setIsEducator(true);
      }

      const token = await getToken();

      const { data } = await axios.get(
        `${backendUrl}/api/user/profile`, // ✅ FIXED ROUTE
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (data.success) {
        setUserData(data.user);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }, [backendUrl, getToken, user]);

  // ================= FETCH ENROLLED COURSES =================
  const fetchUserEnrolledCourses = useCallback(async () => {
    try {
      const token = await getToken();

      const { data } = await axios.get(
        `${backendUrl}/api/user/courses`, // ✅ FIXED ROUTE
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (data.success) {
        setEnrolledCourses(data.enrolledCourses?.reverse() || []);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }, [backendUrl, getToken]);

  // ================= USE EFFECTS =================
  useEffect(() => {
    fetchAllCourses();
  }, [fetchAllCourses]);

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchUserEnrolledCourses();
    }
  }, [user, fetchUserData, fetchUserEnrolledCourses]);

  // ================= HELPERS =================

  // ⭐ Calculate rating
  const calculateRating = (course) => {
    if (!course?.courseRatings?.length) return 0;

    let total = 0;
    course.courseRatings.forEach((r) => {
      total += r.rating;
    });

    return Math.floor(total / course.courseRatings.length);
  };

  // ⏱ Chapter duration
  const calculateChapterTime = (chapter) => {
    let time = 0;

    chapter?.chapterContent?.forEach(
      (lecture) => (time += lecture.lectureDuration || 0),
    );

    return humanizeDuration(time * 60 * 1000, {
      units: ["h", "m"],
      round: true,
    });
  };

  // ⏳ Course duration
  const calculateCourseDuration = (course) => {
    let time = 0;

    course?.courseContent?.forEach((chapter) =>
      chapter?.chapterContent?.forEach(
        (lecture) => (time += lecture.lectureDuration || 0),
      ),
    );

    return humanizeDuration(time * 60 * 1000, {
      units: ["h", "m"],
      round: true,
    });
  };

  // 📚 Total lectures
  const calculateNoOfCourses = (course) => {
    let total = 0;

    course?.courseContent?.forEach((chapter) => {
      if (Array.isArray(chapter?.chapterContent)) {
        total += chapter.chapterContent.length;
      }
    });

    return total;
  };

  // ================= CONTEXT VALUE =================
  const value = {
    currency,
    allCourses,
    navigate,
    calculateRating,
    isEducator,
    setIsEducator,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfCourses,
    enrolledCourses,
    fetchUserEnrolledCourses,
    backendUrl,
    userData,
    setUserData,
    getToken,
    fetchAllCourses,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
