import Course from "../models/Course.js";

/* GET ALL COURSES */
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .select("-courseContent -enrolledStudents")
      .populate("educator");

    res.json({ success: true, courses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/* GET COURSE BY ID */
export const getCourseId = async (req, res) => {
  try {
    const courseData = await Course.findById(req.params.id).populate(
      "educator",
      "name imageUrl",
    );

    if (!courseData)
      return res.json({ success: false, message: "Course not found" });

    courseData.courseContent?.forEach((chapter) => {
      chapter.chapterContent?.forEach((lecture) => {
        if (!lecture.isPreviewFree) {
          lecture.lectureUrl = "";
        }
      });
    });

    res.json({ success: true, courseData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
