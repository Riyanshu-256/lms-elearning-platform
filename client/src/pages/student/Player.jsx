import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { useParams } from "react-router-dom";
import Youtube from "react-youtube";
import humanizeDuration from "humanize-duration";
import { assets } from "../../assets/assets";
import Footer from "../../components/student/Footer";

const Player = () => {
  const { enrolledCourses, calculateChapterTime } = useContext(AppContext);
  const { courseId } = useParams();

  const [courseData, setCourseData] = useState(null);
  const [openIndex, setOpenIndex] = useState(0);
  const [playerData, setPlayerData] = useState(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const course = enrolledCourses.find((c) => c._id === courseId);
    setCourseData(course);
  }, [courseId, enrolledCourses]);

  if (!courseData) return null;

  return (
    <>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-2 gap-12">
          {/* LEFT COLUMN */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Course Structure
            </h2>

            <div className="space-y-4">
              {courseData.courseContent.map((chapter, index) => (
                <div
                  key={index}
                  className="bg-white border rounded-xl shadow-sm overflow-hidden"
                >
                  {/* Chapter Header */}
                  <div
                    onClick={() =>
                      setOpenIndex(openIndex === index ? null : index)
                    }
                    className="flex justify-between items-center px-5 py-4 cursor-pointer hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={assets.down_arrow_icon}
                        className={`w-4 transition ${
                          openIndex === index ? "rotate-180" : ""
                        }`}
                        alt=""
                      />
                      <p className="font-medium">{chapter.chapterTitle}</p>
                    </div>

                    <p className="text-sm text-gray-500">
                      {chapter.chapterContent.length} lectures •{" "}
                      {calculateChapterTime(chapter)}
                    </p>
                  </div>

                  {/* Lectures */}
                  {openIndex === index && (
                    <ul className="px-5 py-4 space-y-4 border-t">
                      {chapter.chapterContent.map((lecture, i) => (
                        <li key={i} className="flex justify-between">
                          <div className="flex gap-3">
                            <img
                              src={assets.play_icon}
                              className="w-4 mt-1"
                              alt=""
                            />

                            <div>
                              <p className="text-sm text-gray-700">
                                {lecture.lectureTitle}
                              </p>

                              <button
                                onClick={() => {
                                  setCompleted(false);
                                  setPlayerData({
                                    videoId: lecture.lectureUrl
                                      .split("/")
                                      .pop(),
                                    title: lecture.lectureTitle,
                                    chapter: chapter.chapterTitle,
                                  });
                                }}
                                className="text-xs text-blue-600 hover:underline"
                              >
                                Watch
                              </button>
                            </div>
                          </div>

                          <p className="text-sm text-gray-500">
                            {humanizeDuration(
                              lecture.lectureDuration * 60 * 1000,
                              { units: ["h", "m"] }
                            )}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
            <div>
              <h1 className="text-xl font-bold">Rate this Course:</h1>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="sticky top-24">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* VIDEO */}
              <div className="relative aspect-video bg-black">
                {playerData ? (
                  <Youtube
                    videoId={playerData.videoId}
                    opts={{
                      width: "100%",
                      height: "100%",
                      playerVars: {
                        autoplay: 1,
                        modestbranding: 1,
                        rel: 0,
                      },
                    }}
                    className="absolute inset-0"
                    iframeClassName="w-full h-full"
                  />
                ) : (
                  <img
                    src={courseData.courseThumbnail}
                    alt="course"
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Play Overlay */}
                {!playerData && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/90 p-4 rounded-full shadow-lg">
                      ▶
                    </div>
                  </div>
                )}
              </div>

              {/* CONTENT */}
              <div className="p-5 space-y-4">
                {/* Lecture Title */}
                <div>
                  <p className="text-sm text-gray-500">Now Playing</p>
                  <h3 className="font-semibold text-gray-800">
                    {playerData
                      ? `${playerData.chapter} - ${playerData.title}`
                      : "Select a lecture to start"}
                  </h3>
                </div>

                {/* ACTIONS */}
                {playerData && (
                  <div className="flex justify-between items-center pt-2">
                    <button
                      onClick={() => setCompleted(!completed)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition
            ${
              completed
                ? "bg-green-100 text-green-600"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
                    >
                      {completed ? "Completed ✓" : "Mark Complete"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Player;
