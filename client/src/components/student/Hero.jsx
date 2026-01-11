import React from "react";
import { assets } from "../../assets/assets";
import SearchBar from "./SearchBar";

const Hero = () => {
  return (
    <section className="flex flex-col items-center justify-center w-full md:pt-36 pt-24 px-7 md:px-0 space-y-8 text-center bg-linear-to-b from-cyan-100/70 to-white">
      {/* Heading */}
      <h1 className="md:text-home-heading-large text-3xl sm:text-5xl relative font-bold text-gray-800 max-w-4xl mx-auto leading-tight">
        Empower your future with expertly crafted courses tailored to your
        career goals.
        <span className="text-blue-600"> Learn. Grow. Succeed.</span>
        <img
          src={assets.sketch}
          alt="sketch"
          className="md:block hidden absolute -bottom-8 right-0"
        />
      </h1>

      {/* Desktop Description */}
      <p className="md:block hidden text-gray-600 max-w-2xl mx-auto text-lg">
        We connect you with industry-leading instructors, immersive learning
        experiences, and a supportive community to help you achieve your
        academic and professional aspirations.
      </p>

      {/* Mobile Description */}
      <p className="md:hidden text-gray-600 max-w-sm mx-auto">
        Advance your career with expert-led courses designed for real-world
        success.
      </p>

      <SearchBar />

      {/* CTA */}
      <button className="mt-4 bg-blue-600 text-white px-10 py-3 rounded-full hover:bg-blue-700 transition shadow-md">
        Start Learning Today
      </button>
    </section>
  );
};

export default Hero;
