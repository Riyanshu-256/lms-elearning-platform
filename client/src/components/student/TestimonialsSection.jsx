import React from "react";
import { dummyTestimonial, assets } from "../../assets/assets";

const TestimonialsSection = () => {
  return (
    <div className="pb-16 px-6 md:px-0 max-w-6xl mx-auto">
      {/* Heading */}
      <h2 className="text-3xl font-semibold text-gray-800 text-center">
        Testimonials
      </h2>
      <p className="text-gray-500 mt-3 text-center">
        Hear from our learners as they share their journeys of transformation,
        success, and how our platform helped them grow.
      </p>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {dummyTestimonial.map((t, index) => (
          <div
            key={index}
            className="text-sm text-left border border-gray-500/30 pb-6 rounded-lg bg-white shadow-[0px_4px_15px_0px] shadow-black/5 overflow-hidden"
          >
            {/* Top header */}
            <div className="flex items-center gap-3 px-5 py-4 bg-gray-50 rounded-t-xl">
              <img
                src={t.image}
                alt={t.name}
                className="h-9 w-9 rounded-full object-cover"
              />

              <div>
                <h3 className="text-sm font-semibold text-gray-800">
                  {t.name}
                </h3>
                <p className="text-xs text-gray-500">{t.role}</p>
              </div>
            </div>

            {/* Rating */}
            <div className="flex gap-1 px-5 pt-4">
              {[...Array(5)].map((_, i) => (
                <img
                  key={i}
                  className="h-4"
                  src={
                    i < Math.floor(t.rating) ? assets.star : assets.star_blank
                  }
                  alt="star"
                />
              ))}
            </div>

            {/* Feedback */}
            <p className="px-5 pt-3 text-sm text-gray-600 leading-relaxed">
              {t.feedback}
            </p>

            {/* Read more */}
            <div className="px-5 pb-5 pt-2">
              <button className="text-sm text-blue-600 hover:underline">
                Read more
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsSection;
