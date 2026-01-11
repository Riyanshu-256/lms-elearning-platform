import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { Link } from "react-router-dom";

const CourseCard = ({ course }) => {
  const { currency } = useContext(AppContext);

  const discountedPrice = (
    course.coursePrice -
    (course.discount * course.coursePrice) / 100
  ).toFixed(2);

  return (
    <Link to={`/course/${course._id}`}>
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer">
        {/* Thumbnail */}
        <div className="relative h-52 w-full overflow-hidden">
          <img
            src={course.courseThumbnail}
            alt={course.courseTitle}
            className="w-full h-44 object-cover"
          />

          {course.discount > 0 && (
            <span className="absolute top-1 left-3 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
              {course.discount}% OFF
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <h3 className="text-[16px] font-semibold text-gray-800 line-clamp-2">
            {course.courseTitle}
          </h3>

          <p className="text-sm text-gray-500">
            By <span className="font-medium">{course.educator.name}</span>
          </p>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">4.5</span>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <img key={i} src={assets.star} className="w-4" />
              ))}
            </div>
            <span className="text-xs text-gray-400">(22)</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3">
            <p className="text-lg font-bold">
              {currency}
              {discountedPrice}
            </p>

            {course.discount > 0 && (
              <p className="text-sm text-gray-400 line-through">
                {currency}
                {course.coursePrice}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
