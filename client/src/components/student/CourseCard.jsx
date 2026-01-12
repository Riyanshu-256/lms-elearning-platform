import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { Link } from "react-router-dom";

const CourseCard = ({ course }) => {
  const { currency, calculateRating } = useContext(AppContext);

  const discountedPrice = (
    course.coursePrice -
    (course.discount * course.coursePrice) / 100
  ).toFixed(2);

  return (
    <Link to={`/course/${course._id}`} className="group block w-full">
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
        {/* Thumbnail */}
        <div className="relative w-full h-44 sm:h-48 md:h-52 overflow-hidden">
          <img
            src={course.courseThumbnail}
            alt={course.courseTitle}
            loading="lazy"
            onError={(e) => {
              e.target.src = assets.placeholder;
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {course.discount > 0 && (
            <span className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
              {course.discount}% OFF
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-3">
          {/* Title */}
          <h3 className="text-sm sm:text-[15px] font-semibold text-gray-800 line-clamp-2">
            {course.courseTitle}
          </h3>

          {/* Educator */}
          <p className="text-xs sm:text-sm text-gray-500">GreatStack</p>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">
              {calculateRating(course)}
            </span>

            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <img
                  key={i}
                  src={
                    i < Math.floor(calculateRating(course))
                      ? assets.star
                      : assets.star_blank
                  }
                  alt="star"
                  className="w-3.5 sm:w-4"
                />
              ))}
            </div>

            <span className="text-xs text-gray-400">
              {course.courseRatings.length}
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3">
            <p className="text-base sm:text-lg font-bold text-gray-900">
              {currency}
              {discountedPrice}
            </p>

            {course.discount > 0 && (
              <p className="text-xs sm:text-sm text-gray-400 line-through">
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
