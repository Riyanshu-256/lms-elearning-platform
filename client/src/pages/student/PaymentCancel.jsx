import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-red-100 flex items-center justify-center">
          <span className="text-3xl text-red-500">!</span>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Payment cancelled
        </h1>
        <p className="text-gray-600 mb-6">
          Your payment was cancelled. You can try again or continue browsing
          other courses.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate("/course-list")}
            className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
          >
            View Courses
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;