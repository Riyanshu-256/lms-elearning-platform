import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import Loading from "../../components/student/Loading";
import { toast } from "react-toastify";

const Dashboard = () => {
  const { currency, backendUrl, isEducator, getToken } = useContext(AppContext);

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= FETCH DASHBOARD DATA =================
  const fetchDashboardData = async () => {
    try {
      const token = await getToken();

      const { data } = await axios.get(backendUrl + "/api/educator/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setDashboardData(data.dashboardData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchDashboardData();
    }
  }, [isEducator]);

  // ================= LOADER =================
  if (loading || !dashboardData) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen p-6 md:p-10 space-y-10 bg-gray-50">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Educator Dashboard
        </h1>
        <p className="text-sm text-gray-500">Overview of your performance</p>
      </div>

      {/* STATS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={assets.patients_icon}
          value={dashboardData.enrolledStudentsData.length}
          label="Total Enrollments"
          color="from-blue-500 to-indigo-500"
        />

        <StatCard
          icon={assets.appointments_icon}
          value={dashboardData.totalCourses}
          label="Total Courses"
          color="from-emerald-500 to-teal-500"
        />

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
              {dashboardData.enrolledStudentsData.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center py-10 text-gray-400">
                    No enrollments found
                  </td>
                </tr>
              )}

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
                      alt="student"
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

/* ================= REUSABLE CARD ================= */

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
