import React, { useEffect, useState } from "react";
import { dummyStudentEnrolled } from "../../assets/assets";
import Loading from "../../components/student/Loading";

const StudentsEnrolled = () => {
  const [enrolledStudents, setEnrolledStudents] = useState(null);

  useEffect(() => {
    setEnrolledStudents(dummyStudentEnrolled);
  }, []);

  if (!enrolledStudents) return <Loading />;

  return (
    <div className="min-h-screen p-6 md:p-10 bg-gray-100">
      {/* PAGE TITLE */}
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
        {/* HEADER */}
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-gray-800 font-medium">Students List</h2>
          <span className="text-sm text-gray-500">
            Total: {enrolledStudents.length}
          </span>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm table-fixed">
            {/* TABLE HEAD */}
            <thead className="bg-gray-50 border-b">
              <tr className="text-gray-500">
                <th className="w-[5%] px-5 py-3 text-center">#</th>
                <th className="w-[35%] px-5 py-3 text-left">Student</th>
                <th className="w-[40%] px-5 py-3 text-left">Course</th>
                <th className="w-[20%] px-5 py-3 text-center">Date</th>
              </tr>
            </thead>

            {/* TABLE BODY */}
            <tbody>
              {enrolledStudents.map((item, index) => (
                <tr
                  key={index}
                  className="border-b last:border-none 
                  hover:bg-indigo-50 transition"
                >
                  {/* SERIAL */}
                  <td className="px-5 py-5 text-center text-gray-500">
                    {index + 1}
                  </td>

                  {/* STUDENT */}
                  <td className="px-5 py-5">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.student.imageUrl}
                        alt="student"
                        className="w-10 h-10 rounded-full border"
                      />
                      <div>
                        <p className="text-gray-800 font-medium">
                          {item.student.name}
                        </p>
                        <p className="text-xs text-gray-500">Student</p>
                      </div>
                    </div>
                  </td>

                  {/* COURSE */}
                  <td className="px-5 py-5 text-gray-700 truncate">
                    {item.courseTitle}
                  </td>

                  {/* DATE */}
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
