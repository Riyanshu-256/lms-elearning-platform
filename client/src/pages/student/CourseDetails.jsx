import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { useContext, useEffect, useState } from "react";
import Loading from "../../components/student/Loading";
import { assets } from "../../assets/assets";
import humanizeDuration from "humanize-duration";
import Footer from "../../components/student/Footer";
import Youtube from "react-youtube";

const CourseDetails = () => {
  const { id } = useParams();

  const {
    allCourses,
    calculateRating,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfCourses,
    currency,
  } = useContext(AppContext);

  const [courseData, setCourseData] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(true);
  const [playerData, setPlayerData] = useState(null);

  // FETCH COURSE
  useEffect(() => {
    if (Array.isArray(allCourses) && allCourses.length > 0) {
      const findCourse = allCourses.find((course) => course?._id === id);
      setCourseData(findCourse || null);
    }
  }, [allCourses, id]);

  if (!courseData) return <Loading />;

  // SAFE VALUES
  const rating = calculateRating(courseData);
  const totalRatings = courseData?.courseRatings?.length || 0;
  const totalStudents = courseData?.enrolledStudents?.length || 0;
  const totalLectures = calculateNoOfCourses(courseData);
  const totalDuration = calculateCourseDuration(courseData);

  const finalPrice =
    courseData.coursePrice -
    (courseData.discount * courseData.coursePrice) / 100;

  return (
    <div className="relative bg-gray-50 min-h-screen">
      <div className="absolute top-0 left-0 w-full h-105 bg-linear-to-b from-cyan-100/80 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-20">
        <div className="grid md:grid-cols-3 gap-10">
          {/* LEFT */}
          <div className="md:col-span-2 space-y-8">
            {/* TITLE */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {courseData.courseTitle}
              </h1>

              <p
                className="mt-4 text-gray-600 text-lg leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: courseData.courseDescription?.slice(0, 250),
                }}
              />
            </div>

            {/* META */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow">
                <span className="font-semibold">{rating.toFixed(1)}</span>

                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <img
                      key={i}
                      src={
                        i < Math.floor(rating) ? assets.star : assets.star_blank
                      }
                      className="w-4"
                      alt=""
                    />
                  ))}
                </div>
              </div>

              <span className="text-blue-600">({totalRatings} reviews)</span>

              <span className="text-gray-400">•</span>

              <span className="text-gray-600">
                {totalStudents} students enrolled
              </span>
            </div>

            {/* CURRICULUM */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Course Curriculum
              </h2>

              <div className="space-y-4">
                {courseData?.courseContent?.map((chapter, index) => (
                  <div
                    key={index}
                    className="bg-white border rounded-xl shadow-sm overflow-hidden"
                  >
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
                        {chapter?.chapterContent?.length || 0} lectures •{" "}
                        {calculateChapterTime(chapter)}
                      </p>
                    </div>

                    {openIndex === index && (
                      <ul className="px-5 py-4 space-y-4 border-t">
                        {chapter?.chapterContent?.map((lecture, i) => (
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

                                {lecture?.isPreviewFree && (
                                  <button
                                    onClick={() =>
                                      setPlayerData({
                                        videoId: lecture.lectureUrl
                                          .split("/")
                                          .pop(),
                                      })
                                    }
                                    className="text-xs text-green-600 hover:underline"
                                  >
                                    ▶ Preview
                                  </button>
                                )}
                              </div>
                            </div>

                            <p className="text-sm text-gray-500">
                              {humanizeDuration(
                                (lecture?.lectureDuration || 0) * 60 * 1000,
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
            </div>

            {/* ABOUT */}
            <div>
              <h2 className="text-xl font-semibold mb-3">About this course</h2>

              <div
                className="text-gray-600 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: courseData.courseDescription,
                }}
              />
            </div>
          </div>

          {/* RIGHT */}
          <div className="sticky top-24 h-fit">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* VIDEO */}
              <div className="relative w-full aspect-video bg-black">
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
                    className="absolute top-0 left-0 w-full h-full"
                    iframeClassName="w-full h-full"
                  />
                ) : (
                  <img
                    src={courseData.courseThumbnail}
                    alt="course"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* CONTENT */}
              <div className="p-6 space-y-5">
                {/* PRICE */}
                <div className="flex items-end gap-3">
                  <p className="text-3xl font-bold">
                    {currency}
                    {finalPrice.toFixed(2)}
                  </p>

                  <p className="text-gray-500 line-through">
                    {currency}
                    {courseData.coursePrice.toFixed(2)}
                  </p>

                  <span className="text-green-600 font-medium">
                    {courseData.discount}% OFF
                  </span>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-3 text-sm text-gray-600">
                  <p>{rating.toFixed(1)}</p>
                  <p>{totalDuration}</p>
                  <p>{totalLectures} lessons</p>
                </div>

                {/* BUTTON */}
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold">
                  {isAlreadyEnrolled ? "Already Enrolled" : "Enroll Now"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CourseDetails;
