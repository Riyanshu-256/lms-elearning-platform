import React, { useEffect, useRef, useState } from "react";
import uniqid from "uniqid";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const AddCourse = () => {
  const quillRef = useRef(null);
  const editorRef = useRef(null);

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

  /* Initialize Quill */
  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Write course description...",
      });
    }
  }, []);

  /* Chapter handlers */
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

    if (action === "toggle") {
      setChapters(
        chapters.map((c) =>
          c.chapterId === id ? { ...c, collapsed: !c.collapsed } : c
        )
      );
    }
  };

  /* Lecture handlers */
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
            : c
        )
      );
    }
  };

  /* Save lecture */
  const saveLecture = () => {
    if (!lectureDetails.lectureTitle) return;

    setChapters(
      chapters.map((c) =>
        c.chapterId === currentChapterId
          ? {
              ...c,
              chapterContent: [...c.chapterContent, lectureDetails],
            }
          : c
      )
    );

    setLectureDetails({
      lectureTitle: "",
      lectureDuration: "",
      lectureUrl: "",
      isPreviewFree: false,
    });

    setShowPopup(false);
  };

  /* MAIN ADD COURSE */
  const handleSubmitCourse = () => {
    const description = quillRef.current.root.innerHTML;

    const courseData = {
      title: courseTitle,
      price: coursePrice,
      discount,
      description,
      image,
      chapters,
    };

    console.log("FINAL COURSE DATA =>", courseData);

    alert("Course Added Successfully 🚀");
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create New Course</h1>
        <p className="text-gray-500">Fill the details to publish your course</p>
      </div>

      {/* Main Card */}
      <div className="bg-white shadow-xl rounded-xl p-6 space-y-6">
        {/* Title */}
        <div>
          <label className="font-medium">Course Title</label>
          <input
            className="mt-1 w-full border rounded-lg px-3 py-2"
            placeholder="Master React JS"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
          />
        </div>

        {/* Price & Discount */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Price</label>
            <input
              type="number"
              className="mt-1 w-full border rounded-lg px-3 py-2"
              value={coursePrice}
              onChange={(e) => setCoursePrice(e.target.value)}
            />
          </div>

          <div>
            <label>Discount (%)</label>
            <input
              type="number"
              className="mt-1 w-full border rounded-lg px-3 py-2"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
            />
          </div>
        </div>

        {/* Thumbnail */}
        <div>
          <label className="font-medium">Course Thumbnail</label>

          <div
            className="relative border-2 border-dashed rounded-xl 
            p-6 flex flex-col items-center justify-center 
            hover:border-blue-500 cursor-pointer"
          >
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0"
              onChange={(e) => setImage(e.target.files[0])}
            />

            {!image ? (
              <>
                <div className="text-4xl">📷</div>
                <p className="mt-2 font-medium">Click to upload thumbnail</p>
                <p className="text-sm text-gray-500">PNG, JPG up to 2MB</p>
              </>
            ) : (
              <>
                <img
                  src={URL.createObjectURL(image)}
                  className="w-48 h-28 object-cover rounded"
                  alt=""
                />
                <p className="text-sm text-gray-500 mt-2">
                  Click to change image
                </p>
              </>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label>Description</label>
          <div ref={editorRef} className="mt-2 bg-white" />
        </div>

        {/* Add Chapter */}
        <button
          onClick={() => handleChapter("add")}
          className="bg-blue-600 text-white 
          px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add Chapter
        </button>

        {/* Chapters */}
        {chapters.map((chapter, i) => (
          <div key={chapter.chapterId} className="border rounded-lg">
            {/* Header */}
            <div className="flex justify-between items-center p-4 bg-gray-100">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleChapter("toggle", chapter.chapterId)}
                >
                  {chapter.collapsed ? "▶" : "▼"}
                </button>

                <p className="font-semibold">
                  {i + 1}. {chapter.chapterTitle}
                </p>

                <span className="text-sm text-gray-500">
                  {chapter.chapterContent.length} Lectures
                </span>
              </div>

              <button
                onClick={() => handleChapter("remove", chapter.chapterId)}
                className="text-gray-500 hover:text-red-500"
              >
                ✖
              </button>
            </div>

            {/* Lectures */}
            {!chapter.collapsed && (
              <div>
                {chapter.chapterContent.map((lec, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between px-5 py-3 border-t"
                  >
                    <p className="text-sm">
                      {idx + 1}. {lec.lectureTitle} –{" "}
                      <span className="text-gray-500">
                        {lec.lectureDuration} mins
                      </span>
                      {lec.isPreviewFree && (
                        <span className="ml-2 text-green-600 font-medium">
                          – Free Preview
                        </span>
                      )}
                    </p>

                    <button
                      onClick={() =>
                        handleLecture("remove", chapter.chapterId, idx)
                      }
                      className="text-gray-400 hover:text-red-500"
                    >
                      ✖
                    </button>
                  </div>
                ))}

                <button
                  onClick={() => handleLecture("add", chapter.chapterId)}
                  className="w-full text-left px-5 py-3 
                  text-blue-600 border-t hover:bg-gray-50"
                >
                  + Add Lecture
                </button>
              </div>
            )}
          </div>
        ))}

        {/* MAIN ADD BUTTON */}
        <button
          onClick={handleSubmitCourse}
          className="w-full bg-black text-white 
          py-3 rounded-lg text-lg"
        >
          ADD
        </button>
      </div>

      {/* Lecture Modal */}
      {showPopup && (
        <div
          className="fixed inset-0 bg-black/40 
        flex items-center justify-center z-50"
        >
          <div className="bg-white w-96 p-6 rounded-xl space-y-4">
            <div className="flex justify-between">
              <h2 className="font-bold">Add Lecture</h2>
              <button onClick={() => setShowPopup(false)}>✖</button>
            </div>

            <input
              placeholder="Lecture Title"
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
              type="number"
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
              placeholder="Lecture URL"
              className="w-full border p-2"
              value={lectureDetails.lectureUrl}
              onChange={(e) =>
                setLectureDetails({
                  ...lectureDetails,
                  lectureUrl: e.target.value,
                })
              }
            />

            <div className="flex gap-2">
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
            </div>

            <button
              onClick={saveLecture}
              className="w-full bg-blue-600 
              text-white py-2 rounded"
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCourse;
