import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/student/Loading";
import axios from "axios";
import toast from "react-hot-toast";

const StudentsEnrolled = () => {
  const { backendUrl, getToken, isEducator } = useContext(AppContext);
  const [enrolledStudents, setEnrolledStudents] = useState(null);

  const fetchEnrolledStudents = async () => {
    try {
      const token = await getToken();

      const { data } = await axios.get(
        backendUrl + "/api/educator/enrolled-students",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (data.success) {
        setEnrolledStudents(data.enrolledStudents.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchEnrolledStudents();
    }
  }, [isEducator]);

  if (!enrolledStudents) return <Loading />;

  return (
    <div className="min-h-screen p-6 md:p-10 bg-gray-100">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">
          Enrolled Students
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage and view all enrolled students
        </p>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-gray-800 font-medium">Students List</h2>
          <span className="text-sm text-gray-500">
            Total: {enrolledStudents.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr className="text-gray-500">
                <th className="px-5 py-3 text-center">#</th>
                <th className="px-5 py-3 text-left">Student</th>
                <th className="px-5 py-3 text-left">Course</th>
                <th className="px-5 py-3 text-center">Date</th>
              </tr>
            </thead>

            <tbody>
              {enrolledStudents.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-10 text-gray-400">
                    No students enrolled yet
                  </td>
                </tr>
              )}

              {enrolledStudents.map((item, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-indigo-50 transition"
                >
                  <td className="px-5 py-5 text-center text-gray-500">
                    {index + 1}
                  </td>

                  <td className="px-5 py-5">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.student.imageUrl}
                        alt="student"
                        className="w-10 h-10 rounded-full border"
                      />
                      <div>
                        <p className="font-medium text-gray-800">
                          {item.student.name}
                        </p>
                        <p className="text-xs text-gray-500">Student</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-5 text-gray-700">
                    {item.courseTitle}
                  </td>

                  <td className="px-5 py-5 text-center text-gray-500">
                    {new Date(item.purchaseDate).toLocaleDateString("en-IN", {
                      day: "2-digit",
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

export default StudentsEnrolled;
