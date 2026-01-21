import React, { useCallback, useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { useParams } from "react-router-dom";
import Youtube from "react-youtube";
import humanizeDuration from "humanize-duration";
import { assets } from "../../assets/assets";
import Footer from "../../components/student/Footer";
import Rating from "../../components/student/Rating";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../../components/student/Loading";

const Player = () => {
  const {
    enrolledCourses,
    calculateChapterTime,
    backendUrl,
    getToken,
    userData,
    fetchUserEnrolledCourses,
  } = useContext(AppContext);

  const { courseId } = useParams();

  // Extract YouTube video ID from different URL formats (watch, share, embed)
  const extractYoutubeId = (url) => {
    if (!url) return null;
    if (!url.startsWith("http")) return url;

    try {
      const u = new URL(url);

      if (u.hostname.includes("youtu.be")) {
        return u.pathname.replace("/", "");
      }

      const vParam = u.searchParams.get("v");
      if (vParam) return vParam;

      const segments = u.pathname.split("/").filter(Boolean);
      return segments[segments.length - 1] || null;
    } catch (e) {
      const clean = url.split("?")[0];
      const parts = clean.split("/");
      return parts[parts.length - 1];
    }
  };

  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [playerData, setPlayerData] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [initialRating, setInitialRating] = useState(0);
  const [courseStatus, setCourseStatus] = useState({
    isEnrolled: false,
    hasRated: false,
  });
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  // ================= GET COURSE DATA =================
  const getCourseData = () => {
    const course = enrolledCourses.find((item) => item._id === courseId);

    if (!course) return;

    setCourseData(course);

    const myRating = course.courseRatings?.find(
      (r) => r.userId === userData?._id,
    );

    if (myRating) {
      setInitialRating(myRating.rating);
    }
  };

  // ================= TOGGLE SECTION =================
  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // ================= GET COURSE PROGRESS =================
  const getCourseProgress = async () => {
    try {
      const token = await getToken();

      const { data } = await axios.post(
        backendUrl + "/api/user/get-course-progress",
        { courseId },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (data.success) {
        setProgressData(data.progressData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ================= MARK COMPLETE =================
  const markLectureAsCompleted = async (lectureId) => {
    try {
      const token = await getToken();

      const { data } = await axios.post(
        backendUrl + "/api/user/update-course-progress",
        { courseId, lectureId },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (data.success) {
        toast.success(data.message);
        getCourseProgress();
        setCompleted(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ================= HANDLE RATING =================
  const handleRate = async (rating) => {
    try {
      if (!courseStatus.isEnrolled) {
        toast.warn("Enroll in the course to rate it");
        return;
      }

      if (courseStatus.hasRated) {
        toast.info("You have already rated this course");
        return;
      }

      const token = await getToken();

      const { data } = await axios.post(
        backendUrl + "/api/user/add-rating",
        { courseId, rating },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (data.success) {
        toast.success(data.message);
        setInitialRating(rating);
        setCourseStatus((prev) => ({ ...prev, hasRated: true }));
        fetchUserEnrolledCourses();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ================= LOAD DATA =================
  useEffect(() => {
    if (enrolledCourses.length > 0 && userData) {
      getCourseData();
      setLoading(false);
    }
  }, [enrolledCourses, userData]);

  // ================= COURSE STATUS =================
  const fetchCourseStatus = useCallback(async () => {
    try {
      if (!userData) return;

      const token = await getToken();
      const { data } = await axios.get(
        `${backendUrl}/api/user/course-status/${courseId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (data.success) {
        setCourseStatus({
          isEnrolled: data.isEnrolled,
          hasRated: data.hasRated,
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }, [backendUrl, courseId, getToken, userData]);

  useEffect(() => {
    fetchCourseStatus();
  }, [fetchCourseStatus]);

  useEffect(() => {
    getCourseProgress();
  }, []);

  // ================= LOADER =================
  if (loading || !courseData) {
    return <Loading />;
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          {/* LEFT */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-800">
              Course Structure
            </h2>

            {courseData.courseContent.map((chapter, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl bg-white mb-3"
              >
                {/* HEADER */}
                <div
                  onClick={() => toggleSection(index)}
                  className="flex justify-between items-center px-5 py-4 cursor-pointer"
                >
                  <div className="flex gap-3 items-center">
                    <img
                      src={assets.down_arrow_icon}
                      className={`w-4 transition ${
                        openSections[index] ? "rotate-180" : ""
                      }`}
                      alt=""
                    />
                    <p className="font-semibold">{chapter.chapterTitle}</p>
                  </div>

                  <p className="text-sm text-gray-500">
                    {chapter.chapterContent.length} lectures •{" "}
                    {calculateChapterTime(chapter)}
                  </p>
                </div>

                {/* LECTURES */}
                {openSections[index] && (
                  <div className="px-5 py-4 border-t bg-gray-50 space-y-4">
                    {chapter.chapterContent.map((lecture, i) => {
                      const isWatched =
                        progressData?.lectureCompleted?.includes(
                          lecture.lectureId,
                        );

                      return (
                        <div
                          key={i}
                          className="flex justify-between items-center"
                        >
                          <div className="flex gap-3">
                            <img
                              src={assets.play_icon}
                              className="w-4 mt-1"
                              alt=""
                            />

                            <div>
                              <p className="text-sm font-medium">
                                {lecture.lectureTitle}
                              </p>

                              <button
                                onClick={() => {
                                  setCompleted(isWatched);
                                  setPlayerData({
                                    videoId: extractYoutubeId(
                                      lecture.lectureUrl,
                                    ),
                                    title: lecture.lectureTitle,
                                    chapter: chapter.chapterTitle,
                                    lectureId: lecture.lectureId,
                                  });
                                }}
                                className="text-xs text-blue-600 hover:underline"
                              >
                                ▶ Watch Now
                              </button>
                            </div>
                          </div>

                          <span className="text-xs text-gray-500">
                            {humanizeDuration(
                              lecture.lectureDuration * 60 * 1000,
                              { units: ["h", "m"] },
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}

            {/* RATING */}
            <div className="bg-white p-6 rounded-xl shadow space-y-3">
              <h2 className="font-semibold">⭐ Rate this Course</h2>
              <Rating
                initialRating={initialRating}
                onRate={handleRate}
                disabled={!courseStatus.isEnrolled || courseStatus.hasRated}
              />
            </div>
          </div>

          {/* RIGHT */}
          <div className="sticky top-24">
            <div className="bg-white rounded-xl shadow overflow-hidden">
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
                  />
                ) : (
                  <img
                    src={courseData.courseThumbnail}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                )}
              </div>

              {/* DETAILS */}
              <div className="p-6 space-y-4">
                <h3 className="font-semibold">
                  {playerData
                    ? `${playerData.chapter} - ${playerData.title}`
                    : "Select a lecture to start"}
                </h3>

                {playerData && (
                  <button
                    onClick={() => markLectureAsCompleted(playerData.lectureId)}
                    className={`px-5 py-2 rounded-lg text-sm
                    ${
                      completed
                        ? "bg-green-100 text-green-600"
                        : "bg-blue-600 text-white"
                    }`}
                  >
                    {completed ? "Completed ✓" : "Mark Complete"}
                  </button>
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
