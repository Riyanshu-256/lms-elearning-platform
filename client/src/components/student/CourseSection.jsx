import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import CourseCard from "./CourseCard";

const CoursesSection = () => {
  const { allCourses } = useContext(AppContext);

  return (
    <section className="py-20 md:px-40 px-8 bg-gray-50">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Learn from industry experts
        </h2>

        <p className="text-sm md:text-base text-gray-600 mt-4">
          Upgrade your skills with job-ready courses built by professionals.
          Learn faster, practice more, and get certified.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mt-14">
        {allCourses.slice(0, 4).map((course, index) => (
          <CourseCard key={index} course={course} />
        ))}
      </div>

      {/* CTA */}
      <div className="flex justify-center mt-14">
        <Link
          to="/course-list"
          onClick={() => window.scrollTo(0, 0)}
          className="bg-indigo-600 text-white px-10 py-3 rounded-full font-medium shadow-sm 
                     hover:bg-indigo-700 transition"
        >
          Explore all courses →
        </Link>
      </div>
    </section>
  );
};

export default CoursesSection;
