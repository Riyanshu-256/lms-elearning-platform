import React, { useContext, useEffect, useRef, useState } from "react";
import uniqid from "uniqid";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import {
  BadgeCheck,
  ChevronDown,
  ChevronUp,
  Clock,
  PlusCircle,
  Trash2,
  UploadCloud,
  Video,
  X,
} from "lucide-react";

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

    if (action === "toggle") {
      setChapters(
        chapters.map((c) =>
          c.chapterId === id ? { ...c, collapsed: !c.collapsed } : c,
        ),
      );
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
    if (!lectureDetails.lectureTitle)
      return toast.error("Lecture title required");

    if (!lectureDetails.lectureUrl) return toast.error("Lecture URL required");

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
      if (!image) return toast.error("Upload thumbnail");

      setLoading(true);

      // Normalize chapters/lectures to match backend Course schema
      const formattedChapters = chapters.map((ch, cIndex) => ({
        chapterId: ch.chapterId,
        chapterOrder: cIndex + 1,
        chapterTitle: ch.chapterTitle,

        chapterContent: ch.chapterContent.map((lec, lIndex) => ({
          lectureId: lec.lectureId || uniqid(),
          lectureTitle: lec.lectureTitle,
          lectureDuration: Number(lec.lectureDuration) || 0,
          lectureUrl: lec.lectureUrl,
          // backend expects `isPreviewFree` after schema change
          isPreviewFree: !!lec.isPreviewFree,
          lectureOrder: lIndex + 1,
        })),
      }));

      const courseData = {
        courseTitle,
        courseDescription: quillRef.current.root.innerHTML,
        coursePrice: Number(coursePrice),
        discount: Number(discount),
        courseContent: formattedChapters,
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
        toast.success("Course published");

        setCourseTitle("");
        setCoursePrice("");
        setDiscount("");
        setImage(null);
        setChapters([]);
        quillRef.current.root.innerHTML = "";
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-8">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
              Add new course
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Fill in the basic details, write a description and organize content
              into chapters.
            </p>
          </div>

          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            <BadgeCheck className="w-4 h-4" />
            Draft mode – nothing is published until you click Publish
          </span>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmitCourse}
          className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)] items-start"
        >
          {/* LEFT: BASIC DETAILS + DESCRIPTION */}
          <section className="space-y-6 bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-6">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">
                Course title
              </label>
              <input
                type="text"
                required
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                placeholder="e.g. Master Data Structures & Algorithms"
                className="w-full rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  Price (in USD)
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400 text-sm">
                    $
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={coursePrice}
                    onChange={(e) => setCoursePrice(e.target.value)}
                    placeholder="49.00"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/70 pl-7 pr-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  Discount % (optional)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  placeholder="10"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            {/* Description / Quill editor */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">
                Detailed description
              </label>
              <div className="rounded-lg border border-slate-200 bg-white min-h-[220px]">
                <div ref={editorRef} className="min-h-[180px]" />
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Use the editor above to add rich text, bullet points and more.
              </p>
            </div>
          </section>

          {/* RIGHT: THUMBNAIL + CHAPTERS */}
          <section className="space-y-6">
            {/* Thumbnail upload */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-6 space-y-4">
              <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-indigo-500" />
                Course thumbnail
              </h2>

              <label
                className="cursor-pointer flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50/70 px-4 py-6 text-center hover:border-indigo-400 hover:bg-indigo-50/60 transition"
              >
                <Video className="w-8 h-8 text-slate-400" />
                <div className="text-xs text-slate-500">
                  <p className="font-medium">Click to upload cover image</p>
                  <p className="text-[11px] mt-0.5">PNG, JPG up to 5MB</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setImage(file);
                  }}
                />
              </label>

              {image && (
                <div className="mt-2 flex items-center justify-between gap-3 rounded-lg bg-slate-50 border border-slate-200 px-3 py-2">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-indigo-100 text-indigo-600 text-[10px] font-semibold">
                      IMG
                    </span>
                    <div className="space-y-0.5">
                      <p className="font-medium truncate max-w-[140px]">
                        {image.name}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {(image.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setImage(null)}
                    className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-50"
                  >
                    <X className="w-3.5 h-3.5 mr-1" />
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Chapters & lectures */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-indigo-500" />
                  Course content
                </h2>
                <button
                  type="button"
                  onClick={() => handleChapter("add")}
                  className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Add chapter
                </button>
              </div>

              {chapters.length === 0 && (
                <p className="text-xs text-slate-400 bg-slate-50 border border-dashed border-slate-200 rounded-lg px-3 py-4 text-center">
                  No chapters yet. Click "Add chapter" to start building your
                  curriculum.
                </p>
              )}

              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                {chapters.map((chapter, idx) => (
                  <div
                    key={chapter.chapterId}
                    className="rounded-xl border border-slate-200 bg-slate-50/70"
                  >
                    {/* Chapter header */}
                    <button
                      type="button"
                      onClick={() => handleChapter("toggle", chapter.chapterId)}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 text-left"
                    >
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-[11px] font-semibold text-indigo-700">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="text-xs font-medium text-slate-800">
                            {chapter.chapterTitle}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {chapter.chapterContent.length} lecture
                            {chapter.chapterContent.length === 1 ? "" : "s"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLecture("add", chapter.chapterId);
                          }}
                          className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-indigo-600 border border-indigo-100 hover:bg-indigo-50"
                        >
                          <PlusCircle className="w-3 h-3" />
                          Lecture
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleChapter("remove", chapter.chapterId);
                          }}
                          className="inline-flex items-center justify-center rounded-full bg-white/70 border border-slate-200 p-1 text-slate-400 hover:text-rose-500 hover:border-rose-200"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        {chapter.collapsed ? (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </button>

                    {/* Lectures */}
                    {!chapter.collapsed && chapter.chapterContent.length > 0 && (
                      <ul className="space-y-1.5 px-3.5 pb-3.5">
                        {chapter.chapterContent.map((lecture, lIndex) => (
                          <li
                            key={lIndex}
                            className="flex items-center justify-between rounded-lg bg-white px-2.5 py-2 text-xs text-slate-700 border border-slate-200"
                          >
                            <div className="flex items-center gap-2">
                              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[10px] text-slate-600">
                                {lIndex + 1}
                              </span>
                              <div>
                                <p className="font-medium truncate max-w-[150px]">
                                  {lecture.lectureTitle}
                                </p>
                                <p className="text-[11px] text-slate-400 flex items-center gap-2">
                                  <span>{lecture.lectureDuration || "--"} min</span>
                                  {lecture.isPreviewFree && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-600">
                                      Free preview
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                handleLecture("remove", chapter.chapterId, lIndex)
                              }
                              className="inline-flex items-center justify-center rounded-full bg-rose-50 text-rose-500 p-1 hover:bg-rose-100"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer actions */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-end">
              <p className="text-[11px] text-slate-400 flex-1">
                You can always edit this course later. Only basic details and at
                least one chapter are required to publish.
              </p>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Publishing..." : "Publish course"}
              </button>
            </div>
          </section>
        </form>
      </div>

      {/* LECTURE POPUP */}
      {showPopup && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Video className="w-4 h-4 text-indigo-500" />
                Add lecture
              </h2>
              <button
                type="button"
                onClick={() => setShowPopup(false)}
                className="rounded-full bg-slate-100 p-1 text-slate-500 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-700">
                  Lecture title
                </label>
                <input
                  type="text"
                  value={lectureDetails.lectureTitle}
                  onChange={(e) =>
                    setLectureDetails({
                      ...lectureDetails,
                      lectureTitle: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  placeholder="Introduction to the course"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-700">
                    Duration (min)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={lectureDetails.lectureDuration}
                    onChange={(e) =>
                      setLectureDetails({
                        ...lectureDetails,
                        lectureDuration: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    placeholder="12"
                  />
                </div>

                <div className="flex items-end gap-2">
                  <input
                    id="previewFree"
                    type="checkbox"
                    checked={lectureDetails.isPreviewFree}
                    onChange={(e) =>
                      setLectureDetails({
                        ...lectureDetails,
                        isPreviewFree: e.target.checked,
                      })
                    }
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label
                    htmlFor="previewFree"
                    className="text-xs text-slate-600 select-none"
                  >
                    Mark as free preview
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-700">
                  Video URL
                </label>
                <input
                  type="url"
                  value={lectureDetails.lectureUrl}
                  onChange={(e) =>
                    setLectureDetails({
                      ...lectureDetails,
                      lectureUrl: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowPopup(false)}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveLecture}
                className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
              >
                Save lecture
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCourse;
