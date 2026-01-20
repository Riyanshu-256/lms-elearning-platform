import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/student/Loading";

const MyCourses = () => {
  const { currency, allCourses } = useContext(AppContext);

  // ✅ always array
  const [courses, setCourses] = useState([]);

  // Fetch educator courses
  const fetchEducationCourses = async () => {
    if (Array.isArray(allCourses)) {
      setCourses(allCourses);
    } else {
      setCourses([]); // safety fallback
    }
  };

  useEffect(() => {
    fetchEducationCourses();
  }, [allCourses]);

  // Loading state
  if (!allCourses) return <Loading />;

  return (
    <div className="w-full min-h-screen bg-gray-50 md:p-8 p-4">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">My Courses</h1>
        <p className="text-sm text-gray-500">
          Manage your published courses and track performance
        </p>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200">
        {/* TOP BAR */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="font-medium text-gray-700">Published Courses</h2>
          <span className="text-sm text-gray-500">Total: {courses.length}</span>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            {/* HEAD */}
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Course</th>
                <th className="px-6 py-3 text-left font-semibold">Earnings</th>
                <th className="px-6 py-3 text-left font-semibold">Students</th>
                <th className="px-6 py-3 text-left font-semibold">Published</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody className="divide-y">
              {courses.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-10 text-gray-400">
                    No courses found
                  </td>
                </tr>
              )}

              {courses.map((course) => (
                <tr key={course._id} className="hover:bg-gray-50 transition">
                  {/* COURSE */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={course.courseThumbnail}
                        alt="Course"
                        className="w-16 h-10 rounded-md object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-800">
                          {course.courseTitle}
                        </p>
                        <p className="text-xs text-gray-400">
                          ID: {course._id.slice(0, 8)}...
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* EARNINGS */}
                  <td className="px-6 py-4 font-medium text-emerald-600">
                    {currency}
                    {Math.floor(
                      (course.enrolledStudents?.length || 0) *
                        (course.coursePrice -
                          (course.discount * course.coursePrice) / 100)
                    )}
                  </td>

                  {/* STUDENTS */}
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-medium">
                      {course.enrolledStudents?.length || 0} enrolled
                    </span>
                  </td>

                  {/* DATE */}
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(course.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyCourses;
