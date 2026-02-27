import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCoursesApi, getLessonsApi, createLessonApi, deleteLessonApi, updateLessonApi } from "../services/api";
import { getUserRole } from "../protected/Auth";
import InstructorDashCard from "../component/InstructorDashCard";
import StudentDashCard from "../component/StudentDashCard";
import toast from "react-hot-toast";

const CourseDetails = () => {
  const { id: courseId } = useParams(); 
  const role = getUserRole();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [lessonForm, setLessonForm] = useState({ title: "", content: "" }); 
  const [editingLessonId, setEditingLessonId] = useState(null);

  const fetchCourse = async () => {
    try {
      const { data } = await getCoursesApi();
      if (data.success) {
        const found = data.courses.find((c) => c.course_id === parseInt(courseId));
        setCourse(found || null);
      }
    } catch (err) {
      console.error("FETCH COURSE ERROR:", err);
      toast.error("Failed to load course");
    }
  };

  const fetchLessons = async () => {
    try {
      const { data } = await getLessonsApi(courseId);
      if (data.success) setLessons(data.lessons);
      else toast.error(data.message || "Failed to load lessons");
    } catch (err) {
      console.error("FETCH LESSONS ERROR:", err);
      toast.error("Failed to load lessons");
    }
  };

  useEffect(() => {
    fetchCourse();
    fetchLessons();
  }, [courseId]);

  const handleLessonSubmit = async (e) => {
    e.preventDefault();
    if (!lessonForm.title || !lessonForm.content) {
      toast.error("All fields are required");
      return;
    }

    try {
      if (editingLessonId) {
        const { data } = await updateLessonApi(editingLessonId, lessonForm);
        if (data.success) {
          toast.success("Lesson updated!");
          setEditingLessonId(null);
          setLessonForm({ title: "", content: "" });
          fetchLessons();
        } else toast.error(data.message || "Failed to update lesson");
      } else {
        const { data } = await createLessonApi({ ...lessonForm, courseId: parseInt(courseId) });
        if (data.success) {
          toast.success("Lesson added!");
          setLessonForm({ title: "", content: "" });
          fetchLessons();
        } else toast.error(data.message || "Failed to add lesson");
      }
    } catch (err) {
      console.error("LESSON ERROR:", err);
      toast.error("Operation failed");
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;
    try {
      const { data } = await deleteLessonApi(lessonId);
      if (data.success) {
        toast.success("Lesson deleted!");
        fetchLessons();
      }
    } catch (err) {
      console.error("DELETE LESSON ERROR:", err);
      toast.error("Failed to delete lesson");
    }
  };

  const handleEditLesson = (lesson) => {
    setEditingLessonId(lesson.lesson_id);
    setLessonForm({ title: lesson.title, content: lesson.content });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row gap-8 p-4 md:p-8">
      <aside className="w-full md:w-80 flex-shrink-0">
        <div className="sticky top-8">
          {role === "instructor" ? <InstructorDashCard /> : <StudentDashCard />}
        </div>
      </aside>

      <div className="flex-1 max-w-5xl">
        {!course ? (
          <p className="text-center text-slate-500 mt-12 font-medium">Loading course details...</p>
        ) : (
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <button
                onClick={() => navigate("/courses")}
                className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm mb-4 flex items-center gap-1 transition-colors"
              >
                ← Back to Courses
              </button>
              <h2 className="text-3xl font-bold text-slate-900 mb-3">{course.title}</h2>
              <p className="text-slate-600 leading-relaxed">{course.description}</p>
            </div>


            {role === "instructor" && (
              <form onSubmit={handleLessonSubmit} className="bg-slate-900 text-white p-8 rounded-2xl shadow-lg space-y-4">
                <h3 className="font-bold text-xl flex items-center gap-2">
                  {editingLessonId ? "✨ Edit Lesson" : "➕ Add New Lesson"}
                </h3>
                <input
                  type="text"
                  placeholder="Lesson Title"
                  value={lessonForm.title}
                  onChange={(e) => setLessonForm((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
                />
                <textarea
                  placeholder="Lesson Content"
                  rows="4"
                  value={lessonForm.content}
                  onChange={(e) => setLessonForm((prev) => ({ ...prev, content: e.target.value }))}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
                />
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className={`px-6 py-2.5 rounded-lg font-bold transition-all active:scale-95 ${
                      editingLessonId ? "bg-amber-500 hover:bg-amber-600 text-amber-950" : "bg-emerald-500 hover:bg-emerald-600"
                    }`}
                  >
                    {editingLessonId ? "Update Lesson" : "Add Lesson"}
                  </button>
                  {editingLessonId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingLessonId(null);
                        setLessonForm({ title: "", content: "" });
                      }}
                      className="px-6 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 font-bold transition-all"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            )}

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-xl text-slate-900 mb-6 flex items-center gap-2">
                📖 Course Curriculum
              </h3>
              {lessons.length === 0 ? (
                <p className="text-slate-400 italic py-4">No lessons added yet.</p>
              ) : (
                <div className="space-y-4">
                  {lessons.map((lesson, index) => (
                    <div key={lesson.lesson_id} className="p-5 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors group">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-xs font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded">
                              LESSON {index + 1}
                            </span>
                            <h4 className="font-bold text-slate-800 text-lg">{lesson.title}</h4>
                          </div>
                          <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{lesson.content}</p>
                        </div>
                        {role === "instructor" && (
                          <div className="flex gap-2 shrink-0">
                            <button
                              onClick={() => handleEditLesson(lesson)}
                              className="px-3 py-1.5 text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white rounded-lg transition-all"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteLesson(lesson.lesson_id)}
                              className="px-3 py-1.5 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded-lg transition-all"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetails;