import React, { useContext, useEffect, useMemo, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/student/Footer";
import axios from "axios";
import toast from "react-hot-toast";

const MyEnrollments = () => {
  const {
    enrolledCourses,
    calculateCourseDuration,
    userData,
    fetchUserEnrolledCourses,
    backendUrl,
    getToken,
    calculateNoOfLectures,
  } = useContext(AppContext);

  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [progressArray, setProgressArray] = useState([]);

  // ================= GET COURSE PROGRESS =================
  const getCourseProgress = async () => {
    try {
      const token = await getToken();

      const tempProgressArray = await Promise.all(
        enrolledCourses.map(async (course) => {
          const { data } = await axios.post(
            `${backendUrl}/api/user/get-course-progress`,
            { courseId: course._id },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          let totalLectures = calculateNoOfLectures(course);

          const lectureCompleted = data?.progressData
            ? data.progressData.lectureCompleted.length
            : 0;

          return { totalLectures, lectureCompleted };
        }),
      );

      setProgressArray(tempProgressArray);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ================= FETCH COURSES =================
  useEffect(() => {
    if (userData) {
      fetchUserEnrolledCourses();
    }
  }, [userData]);

  // ================= FETCH PROGRESS =================
  useEffect(() => {
    if (enrolledCourses.length > 0) {
      getCourseProgress();
    }
  }, [enrolledCourses]);

  // ================= FILTER COURSES =================
  const filteredCourses = useMemo(() => {
    return enrolledCourses.filter((course, i) => {
      const matchSearch = course.courseTitle
        .toLowerCase()
        .includes(search.toLowerCase());

      const data = progressArray[i] || {
        lectureCompleted: 0,
        totalLectures: 0,
      };

      const isCompleted = data.lectureCompleted === data.totalLectures;

      if (filter === "completed") return matchSearch && isCompleted;
      if (filter === "ongoing") return matchSearch && !isCompleted;

      return matchSearch;
    });
  }, [search, filter, enrolledCourses, progressArray]);

  return (
    <>
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold">My Enrollments</h1>

          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border px-4 py-2 rounded-lg text-sm focus:outline-none"
            />

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border px-3 py-2 rounded-lg text-sm"
            >
              <option value="all">All</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr className="text-left text-gray-600">
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Progress</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredCourses.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-14 text-gray-500">
                    No courses found
                  </td>
                </tr>
              )}

              {filteredCourses.map((course) => {
                const realIndex = enrolledCourses.findIndex(
                  (c) => c._id === course._id,
                );

                const data = progressArray[realIndex] || {
                  lectureCompleted: 0,
                  totalLectures: 0,
                };

                const completed = data.lectureCompleted;
                const total = data.totalLectures;

                const percentage =
                  total === 0 ? 0 : Math.round((completed / total) * 100);

                const isCompleted = completed === total;

                return (
                  <tr
                    key={course._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    {/* Course */}
                    <td className="px-6 py-5 flex items-center gap-4">
                      <img
                        src={course.courseThumbnail}
                        alt={course.courseTitle}
                        className="w-28 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-semibold">{course.courseTitle}</p>
                        <p className="text-xs text-gray-500">Programming</p>
                      </div>
                    </td>

                    {/* Duration */}
                    <td className="px-6 py-5">
                      {calculateCourseDuration(course)}
                    </td>

                    {/* Progress */}
                    <td className="px-6 py-5">
                      <div className="flex justify-between text-xs mb-1">
                        <span>
                          {completed}/{total} lectures
                        </span>
                        <span>{percentage}%</span>
                      </div>

                      <div className="h-2 bg-gray-200 rounded-full">
                        <div
                          className={`h-2 rounded-full transition-all
                          ${isCompleted ? "bg-green-500" : "bg-blue-500"}`}
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-5">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium
                        ${
                          isCompleted
                            ? "bg-green-100 text-green-600"
                            : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {isCompleted ? "Completed" : "Ongoing"}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-6 py-5">
                      <button
                        onClick={() => navigate(`/player/${course._id}`)}
                        className="bg-blue-500 hover:bg-blue-600
                        text-white px-4 py-1.5 rounded-md
                        text-xs font-medium transition"
                      >
                        {isCompleted ? "View" : "Resume"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default MyEnrollments;
