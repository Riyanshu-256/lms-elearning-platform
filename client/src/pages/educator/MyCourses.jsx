import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import Loading from "../../components/student/Loading";
import toast from "react-hot-toast";

const MyCourses = () => {
  const { backendUrl, getToken, currency, isEducator } = useContext(AppContext);

  const [courses, setCourses] = useState(null);

  const fetchEducationCourses = async () => {
    try {
      const token = await getToken();

      const { data } = await axios.get(backendUrl + "/api/educator/courses", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setCourses(data.courses);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchEducationCourses();
    }
  }, [isEducator]);

  if (!courses) return <Loading />;

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
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="font-medium text-gray-700">Published Courses</h2>
          <span className="text-sm text-gray-500">Total: {courses.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left">Course</th>
                <th className="px-6 py-3 text-left">Earnings</th>
                <th className="px-6 py-3 text-left">Students</th>
                <th className="px-6 py-3 text-left">Published</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {courses.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-10 text-gray-400">
                    No courses found
                  </td>
                </tr>
              )}

              {courses.map((course) => {
                const finalPrice =
                  course.coursePrice -
                  (course.discount * course.coursePrice) / 100;

                const earnings =
                  (course.enrolledStudents?.length || 0) * finalPrice;

                return (
                  <tr key={course._id} className="hover:bg-gray-50 transition">
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

                    <td className="px-6 py-4 font-medium text-emerald-600">
                      {currency}
                      {Math.floor(earnings)}
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-medium">
                        {course.enrolledStudents?.length || 0} enrolled
                      </span>
                    </td>

                    <td className="px-6 py-4 text-gray-500">
                      {new Date(course.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyCourses;
