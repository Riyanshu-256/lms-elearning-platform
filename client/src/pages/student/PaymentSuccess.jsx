import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");

  const { backendUrl, getToken, fetchUserEnrolledCourses } =
    useContext(AppContext);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const confirmPurchase = async () => {
      try {
        const token = await getToken();

        const { data } = await axios.post(
          `${backendUrl}/api/user/confirm-purchase`,
          { sessionId },
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (data.success) {
          await fetchUserEnrolledCourses();
        } else {
          toast.error(data.message);
        }
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) confirmPurchase();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md text-center">
        <h1 className="text-2xl font-semibold mb-2">Payment Successful 🎉</h1>

        <p className="text-gray-600 mb-4">
          {loading ? "Confirming enrollment..." : "Enrollment confirmed!"}
        </p>

        <button
          onClick={() => navigate("/my-enrollments")}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          Go to My Enrollments
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
