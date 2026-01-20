import React, { useContext, useEffect, useRef, useState } from "react";
import uniqid from "uniqid";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";

const AddCourse = () => {
  const { backendUrl, getToken } = useContext(AppContext);
  const quillRef = useRef(null);
  const editorRef = useRef(null);

  const [loading, setLoading] = useState(false);

  const [courseTitle, setCourseTitle] = useState("");
  const [coursePrice, setCoursePrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [image, setImage] = useState(null);

  const [chapters, setChapters] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);

  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: "",
    lectureDuration: "",
    lectureUrl: "",
    isPreviewFree: false,
  });

  /* INIT QUILL */
  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Write detailed course description...",
      });
    }
  }, []);

  /* CHAPTER HANDLER */
  const handleChapter = (action, id) => {
    if (action === "add") {
      const title = prompt("Enter chapter name");
      if (!title) return;

      setChapters([
        ...chapters,
        {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
        },
      ]);
    }

    if (action === "remove") {
      setChapters(chapters.filter((c) => c.chapterId !== id));
    }
  };

  /* LECTURE HANDLER */
  const handleLecture = (action, id, index) => {
    if (action === "add") {
      setCurrentChapterId(id);
      setShowPopup(true);
    }

    if (action === "remove") {
      setChapters(
        chapters.map((c) =>
          c.chapterId === id
            ? {
                ...c,
                chapterContent: c.chapterContent.filter((_, i) => i !== index),
              }
            : c,
        ),
      );
    }
  };

  /* SAVE LECTURE */
  const saveLecture = () => {
    if (!lectureDetails.lectureTitle) {
      toast.error("Lecture title required");
      return;
    }

    setChapters(
      chapters.map((c) =>
        c.chapterId === currentChapterId
          ? {
              ...c,
              chapterContent: [...c.chapterContent, lectureDetails],
            }
          : c,
      ),
    );

    setLectureDetails({
      lectureTitle: "",
      lectureDuration: "",
      lectureUrl: "",
      isPreviewFree: false,
    });

    setShowPopup(false);
  };

  /* SUBMIT */
  const handleSubmitCourse = async (e) => {
    e.preventDefault();

    try {
      if (!image) {
        return toast.error("Please upload thumbnail");
      }

      setLoading(true);

      const courseData = {
        courseTitle,
        courseDescription: quillRef.current.root.innerHTML,
        coursePrice: Number(coursePrice),
        discount: Number(discount),
        courseContent: chapters,
      };

      const formData = new FormData();
      formData.append("courseData", JSON.stringify(courseData));
      formData.append("image", image);

      const token = await getToken();

      const { data } = await axios.post(
        backendUrl + "/api/educator/add-course",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (data.success) {
        toast.success("Course published successfully");

        setCourseTitle("");
        setCoursePrice("");
        setDiscount("");
        setImage(null);
        setChapters([]);

        quillRef.current.root.innerHTML = "";
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create New Course</h1>
        <p className="text-gray-500">Fill all details to publish your course</p>
      </div>

      <form
        onSubmit={handleSubmitCourse}
        className="bg-white shadow-lg rounded-xl p-6 space-y-6"
      >
        {/* BASIC INFO */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label>Course Title</label>
            <input
              className="w-full border p-2 rounded mt-1"
              placeholder="Master React"
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
            />
          </div>

          <div>
            <label>Price</label>
            <input
              type="number"
              className="w-full border p-2 rounded mt-1"
              value={coursePrice}
              onChange={(e) => setCoursePrice(e.target.value)}
            />
          </div>
        </div>

        {/* DISCOUNT */}
        <div>
          <label>Discount (%)</label>
          <input
            type="number"
            className="w-full border p-2 rounded mt-1"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
          />
        </div>

        {/* THUMBNAIL */}
        <div>
          <label>Course Thumbnail</label>

          <div className="mt-2 border-2 border-dashed p-5 rounded-xl text-center cursor-pointer hover:border-blue-600">
            <input
              type="file"
              accept="image/*"
              hidden
              id="thumb"
              onChange={(e) => setImage(e.target.files[0])}
            />

            <label htmlFor="thumb" className="cursor-pointer">
              {!image ? (
                <>
                  <p className="text-3xl">📸</p>
                  <p>Click to upload image</p>
                </>
              ) : (
                <img
                  src={URL.createObjectURL(image)}
                  className="mx-auto h-40 rounded"
                  alt=""
                />
              )}
            </label>
          </div>
        </div>

        {/* DESCRIPTION */}
        <div>
          <label>Description</label>
          <div ref={editorRef} className="bg-white border rounded mt-2" />
        </div>

        {/* CHAPTER */}
        <button
          type="button"
          onClick={() => handleChapter("add")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Chapter
        </button>

        {/* CHAPTER LIST */}
        {chapters.map((chapter, i) => (
          <div key={chapter.chapterId} className="border rounded-lg">
            <div className="flex justify-between p-3 bg-gray-100">
              <p>
                {i + 1}. {chapter.chapterTitle}
              </p>

              <button
                type="button"
                onClick={() => handleChapter("remove", chapter.chapterId)}
              >
                ❌
              </button>
            </div>

            {chapter.chapterContent.map((lec, idx) => (
              <div
                key={idx}
                className="flex justify-between px-4 py-2 border-t"
              >
                <p>
                  {lec.lectureTitle} – {lec.lectureDuration} min
                </p>

                <button
                  type="button"
                  onClick={() =>
                    handleLecture("remove", chapter.chapterId, idx)
                  }
                >
                  ❌
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => handleLecture("add", chapter.chapterId)}
              className="w-full text-left px-4 py-2 text-blue-600"
            >
              + Add Lecture
            </button>
          </div>
        ))}

        {/* SUBMIT */}
        <button
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded text-lg"
        >
          {loading ? "Publishing..." : "Publish Course"}
        </button>
      </form>

      {/* MODAL */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-96 space-y-3">
            <h2 className="font-bold text-lg">Add Lecture</h2>

            <input
              placeholder="Lecture title"
              className="w-full border p-2"
              value={lectureDetails.lectureTitle}
              onChange={(e) =>
                setLectureDetails({
                  ...lectureDetails,
                  lectureTitle: e.target.value,
                })
              }
            />

            <input
              placeholder="Duration"
              className="w-full border p-2"
              value={lectureDetails.lectureDuration}
              onChange={(e) =>
                setLectureDetails({
                  ...lectureDetails,
                  lectureDuration: e.target.value,
                })
              }
            />

            <input
              placeholder="Video URL"
              className="w-full border p-2"
              value={lectureDetails.lectureUrl}
              onChange={(e) =>
                setLectureDetails({
                  ...lectureDetails,
                  lectureUrl: e.target.value,
                })
              }
            />

            <label className="flex gap-2">
              <input
                type="checkbox"
                checked={lectureDetails.isPreviewFree}
                onChange={(e) =>
                  setLectureDetails({
                    ...lectureDetails,
                    isPreviewFree: e.target.checked,
                  })
                }
              />
              Free Preview
            </label>

            <button
              onClick={saveLecture}
              className="w-full bg-blue-600 text-white py-2 rounded"
            >
              Add Lecture
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCourse;
