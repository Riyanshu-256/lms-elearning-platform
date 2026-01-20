import React from "react";
import { Route, Routes, useMatch, Navigate } from "react-router-dom";

// Student Pages
import Home from "./pages/student/Home";
import CourseList from "./pages/student/CourseList";
import CourseDetails from "./pages/student/CourseDetails";
import MyEnrollments from "./pages/student/MyEnrollments";
import Player from "./pages/student/Player";
import PaymentSuccess from "./pages/student/PaymentSuccess";
import PaymentCancel from "./pages/student/PaymentCancel";
import "quill/dist/quill.snow.css";

// Components
import Loading from "./components/student/Loading";
import Navbar from "./components/student/Navbar";

// Educator Pages
import Educator from "./pages/educator/Educator";
import AddCourse from "./pages/educator/AddCourse";
import Dashboard from "./pages/educator/Dashboard";
import MyCourse from "./pages/educator/MyCourses";
import StudentsEnrolled from "./pages/educator/StudentsEnrolled";

// Toast
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const isEducatorRoute = useMatch("/educator/*");

  return (
    <div className="text-default min-h-screen bg-white">
      {/* TOAST */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />

      {/* NAVBAR */}
      {!isEducatorRoute && <Navbar />}

      <Routes>
        {/* ================= STUDENT ROUTES ================= */}
        <Route path="/" element={<Home />} />

        <Route path="/course-list" element={<CourseList />} />
        <Route path="/course-list/:input" element={<CourseList />} />

        {/* FIXED ROUTE */}
        <Route path="/course-details/:id" element={<CourseDetails />} />

        {/* BLOCK OLD ROUTE */}
        <Route
          path="/course/:id"
          element={<Navigate to="/course-list" replace />}
        />

        <Route path="/my-enrollments" element={<MyEnrollments />} />
        <Route path="/player/:courseId" element={<Player />} />
        <Route path="/loading/:path" element={<Loading />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancel" element={<PaymentCancel />} />

        {/* ================= EDUCATOR ROUTES ================= */}
        <Route path="/educator" element={<Educator />}>
          <Route index element={<Dashboard />} />
          <Route path="add-course" element={<AddCourse />} />
          <Route path="my-courses" element={<MyCourse />} />
          <Route path="students-enrolled" element={<StudentsEnrolled />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
