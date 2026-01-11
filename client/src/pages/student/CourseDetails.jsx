import { useParams } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";

const CourseDetails = () => {
  const { id } = useParams();
  const { allCourses } = useContext(AppContext);

  const course = allCourses.find((c) => c._id === id);

  if (!course) return <p>Course not found</p>;

  return (
    <div className="px-10 py-16">
      <h1 className="text-3xl font-bold">{course.courseTitle}</h1>
      <img src={course.courseThumbnail} className="w-full max-w-xl mt-6" />
      <p className="mt-4">{course.description}</p>
    </div>
  );
};

export default CourseDetails;
