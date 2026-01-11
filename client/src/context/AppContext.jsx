// Import hooks from React
import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";

// Create global context
export const AppContext = createContext();

// Context Provider
export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;

  const [allCourses, setAllCourses] = useState([]);

  // Fetch all courses (mock API)
  const fetchAllCourses = async () => {
    setAllCourses(dummyCourses);
  };

  useEffect(() => {
    fetchAllCourses();
  }, []);

  const value = {
    currency,
    allCourses,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
