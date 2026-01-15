// Import hooks from React
import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import { useAuth, useUser } from "@clerk/clerk-react";

// Create global context
export const AppContext = createContext();

// Context Provider
export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  const { getToken } = useAuth();
  const { user } = useUser();

  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  // Fetch all courses (mock API)
  const fetchAllCourses = async () => {
    setAllCourses(dummyCourses);
  };

  // Fetch user enrolled courses
  const fetchUserEnrolledCourses = async () => {
    setEnrolledCourses(dummyCourses); // mock
  };

  useEffect(() => {
    fetchAllCourses();
    fetchUserEnrolledCourses();
  }, []);

  // ✅ Correct JWT Token (Backend template)
  const logToken = async () => {
    try {
      const token = await getToken({ template: "backend" });
      console.log("JWT TOKEN:", token);
    } catch (error) {
      console.log("Token error:", error);
    }
  };

  useEffect(() => {
    if (user) {
      logToken();
    }
  }, [user]);

  // Function to calculate average rating
  const calculateRating = (course) => {
    if (course.courseRatings.length === 0) return 0;

    let total = 0;
    course.courseRatings.forEach((r) => {
      total += r.rating;
    });

    return total / course.courseRatings.length;
  };

  // Function to calculate chapter time
  const calculateChapterTime = (chapter) => {
    let time = 0;

    chapter.chapterContent.forEach(
      (lecture) => (time += lecture.lectureDuration)
    );

    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  // Function to calculate course duration
  const calculateCourseDuration = (course) => {
    let time = 0;

    course.courseContent.forEach((chapter) =>
      chapter.chapterContent.forEach(
        (lecture) => (time += lecture.lectureDuration)
      )
    );

    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  // Function to calculate lectures count
  const calculateNoOfCourses = (course) => {
    let total = 0;

    course.courseContent.forEach((chapter) => {
      if (Array.isArray(chapter.chapterContent)) {
        total += chapter.chapterContent.length;
      }
    });

    return total;
  };

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
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
