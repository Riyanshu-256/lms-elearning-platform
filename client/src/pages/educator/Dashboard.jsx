import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { dummyDashboardData, assets } from "../../assets/assets";
import Loading from "../../components/student/Loading";

const Dashboard = () => {
  // Craete a variable to store the data of dashboardData
  const [dashboardData, setDashboardData] = useState(null);

  // import currency from AppContext
  const { currency } = useContext(AppContext);

  // Fetch the data of dashboardData
  useEffect(() => {
    setDashboardData(dummyDashboardData);
  }, []);

  if (!dashboardData) return <Loading />;

  return (
    <div className="min-h-screen p-6 md:p-10 space-y-10 bg-gray-50">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">
          Educator Dashboard
        </h1>
      </div>

      {/* STATS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Enrollments */}
        <StatCard
          icon={assets.patients_icon}
          value={dashboardData.enrolledStudentsData.length}
          label="Total Enrollments"
          color="from-blue-500 to-indigo-500"
        />

        {/* Courses */}
        <StatCard
          icon={assets.appointments_icon}
          value={dashboardData.totalCourses}
          label="Total Courses"
          color="from-emerald-500 to-teal-500"
        />

        {/* Earnings */}
        <StatCard
          icon={assets.earning_icon}
          value={`${currency}${dashboardData.totalEarnings}`}
          label="Total Earnings"
          color="from-violet-500 to-fuchsia-500"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <h2 className="px-6 py-4 font-semibold border-b text-gray-700">
          Latest Enrollments
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-center hidden sm:table-cell">
                  #
                </th>
                <th className="px-4 py-3 text-left">Student</th>
                <th className="px-4 py-3 text-left">Course</th>
              </tr>
            </thead>

            <tbody>
              {dashboardData.enrolledStudentsData.map((item, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 text-center hidden sm:table-cell">
                    {index + 1}
                  </td>

                  <td className="px-4 py-3 flex items-center gap-3">
                    <img
                      src={item.student.imageUrl}
                      className="w-10 h-10 rounded-full ring-2 ring-blue-500"
                      alt=""
                    />
                    <p className="font-medium text-gray-700">
                      {item.student.name}
                    </p>
                  </td>

                  <td className="px-4 py-3 text-gray-600">
                    {item.courseTitle}
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

/* Reusable Card */
const StatCard = ({ icon, value, label, color }) => (
  <div
    className={`bg-linear-to-r ${color} 
    rounded-xl p-5 text-white 
    shadow-lg hover:scale-[1.03] transition`}
  >
    <div className="flex items-center gap-4">
      <img src={icon} className="w-12" alt="" />
      <div>
        <h2 className="text-2xl font-semibold">{value}</h2>
        <p className="text-sm opacity-90">{label}</p>
      </div>
    </div>
  </div>
);

export default Dashboard;
