import React from "react";
import { Route, Routes, useMatch } from "react-router-dom";

// Student Pages
import Home from "./pages/student/Home";
import CourseList from "./pages/student/CourseList";
import CourseDetails from "./pages/student/CourseDetails";
import MyEnrollments from "./pages/student/MyEnrollments";
import Player from "./pages/student/Player";

// Components
import Loading from "./components/student/Loading";

// Educator Pages
import Educator from "./pages/educator/Educator";
import AddCourse from "./pages/educator/AddCourse";
import Dashboard from "./pages/educator/Dashboard";
import MyCourse from "./pages/educator/MyCourses";
import StudentsEnrolled from "./pages/educator/StudentsEnrolled";
import Navbar from "./components/student/Navbar";

const App = () => {
  // Navbar for educator
  const isEducatorRoute = useMatch("/educator/*");

  return (
    <div className="text-default min-h-screen bg-white">
      {!isEducatorRoute && <Navbar />}
      <Routes>
        {/* Student Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/course-list/:input" element={<CourseList />} />
        <Route path="/course-details/:id" element={<CourseDetails />} />
        <Route path="/my-enrollments" element={<MyEnrollments />} />
        <Route path="/player/:courseId" element={<Player />} />
        <Route path="/loading/:path" element={<Loading />} />

        {/* Educator Routes */}
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
