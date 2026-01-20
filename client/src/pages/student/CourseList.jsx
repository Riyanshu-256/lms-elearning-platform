import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import SearchBar from "../../components/student/SearchBar";
import { useParams } from "react-router-dom";
import CourseCard from "../../components/student/CourseCard";
import { assets } from "../../assets/assets";
import Footer from "../../components/student/Footer";

const CourseList = () => {
  const { navigate, allCourses } = useContext(AppContext);
  const { input } = useParams();

  const [filteredCourse, setFilteredCourse] = useState([]);

  useEffect(() => {
    if (allCourses?.length > 0) {
      let tempCourses = [...allCourses];

      if (input) {
        const result = tempCourses.filter((item) =>
          item?.courseTitle?.toLowerCase().includes(input.toLowerCase()),
        );
        setFilteredCourse(result);
      } else {
        setFilteredCourse(tempCourses);
      }
    } else {
      setFilteredCourse([]);
    }
  }, [allCourses, input]);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-10">
        {/* HEADER */}
        <div
          className="flex flex-col md:flex-row md:items-center 
                        md:justify-between gap-6 md:gap-24 mb-10"
        >
          {/* Title */}
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Course List</h1>

            <p className="text-gray-500 mt-2 text-sm">
              <span
                className="text-blue-600 font-medium cursor-pointer hover:underline"
                onClick={() => navigate("/")}
              >
                Home
              </span>{" "}
              / <span className="text-gray-700">Course List</span>
            </p>
          </div>

          {/* Search */}
          <div className="w-full md:w-105">
            <SearchBar data={input || ""} />
          </div>
        </div>

        {/* SEARCH TAG */}
        {input && (
          <div
            className="inline-flex items-center gap-4 px-4 py-2 
                          border mt-8 mb-8 text-gray-600 rounded-md"
          >
            <p>{input}</p>

            <img
              src={assets.cross_icon}
              alt="clear"
              className="w-90 h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onClick={() => navigate("/course-list")}
            />
          </div>
        )}

        {/* COURSES */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 
                        lg:grid-cols-3 gap-6"
        >
          {filteredCourse.length > 0 ? (
            filteredCourse.map((course) => (
              <div
                key={course?._id}
                onClick={() => {
                  if (course?._id) {
                    navigate(`/course-details/${course._id}`);
                  }
                }}
                className="cursor-pointer"
              >
                <CourseCard course={course} />
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center">
              No courses found
            </p>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CourseList;
