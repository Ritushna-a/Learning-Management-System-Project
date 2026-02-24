import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCoursesApi, getLessonsApi, createLessonApi, deleteLessonApi, updateLessonApi } from "../services/api";
import { getUserRole } from "../protected/Auth";
import InstructorDashCard from "../component/InstructorDashCard";
import StudentDashCard from "../component/StudentDashCard";
import toast from "react-hot-toast";

const CourseDetails = () => {
  const { id: courseId } = useParams(); 
  const role = getUserRole();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [lessonForm, setLessonForm] = useState({ title: "", content: "", thumbnail: null });
  const [editingLessonId, setEditingLessonId] = useState(null); // for editing

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
          setLessonForm({ title: "", content: "", thumbnail: null });
          fetchLessons();
        } else toast.error(data.message || "Failed to update lesson");
      } else {
        const { data } = await createLessonApi({ ...lessonForm, courseId: parseInt(courseId) });
        if (data.success) {
          toast.success("Lesson added!");
          setLessonForm({ title: "", content: "", thumbnail: null });
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
    setLessonForm({ title: lesson.title, content: lesson.content, thumbnail: lesson.thumbnail || null });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex gap-6 p-6">
      {role === "instructor" ? <InstructorDashCard /> : <StudentDashCard />}

      <div className="flex-1">
        {!course ? (
          <p className="text-center text-gray-500 mt-6">Loading course...</p>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
            <h2 className="text-2xl font-semibold mb-2">{course.title}</h2>
            <p className="text-gray-600">{course.description}</p>
            {course.thumbnail && (
              <img
                src={`${import.meta.env.VITE_API_BASE_URL}${course.thumbnail}`}
                alt="Course Thumbnail"
                className="mt-2 w-full max-w-md rounded"
              />
            )}

            {role === "instructor" && (
              <form onSubmit={handleLessonSubmit} className="border-t pt-4 space-y-3">
                <h3 className="font-semibold text-lg">{editingLessonId ? "Edit Lesson" : "Add New Lesson"}</h3>
                <input
                  type="text"
                  placeholder="Lesson Title"
                  value={lessonForm.title}
                  onChange={(e) => setLessonForm((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
                />
                <textarea
                  placeholder="Lesson Content"
                  value={lessonForm.content}
                  onChange={(e) => setLessonForm((prev) => ({ ...prev, content: e.target.value }))}
                  className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
                />
                <button
                  type="submit"
                  className={`px-4 py-2 rounded text-white ${
                    editingLessonId ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {editingLessonId ? "Update Lesson" : "Add Lesson"}
                </button>
                {editingLessonId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingLessonId(null);
                      setLessonForm({ title: "", content: "", thumbnail: null });
                    }}
                    className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-black ml-2"
                  >
                    Cancel
                  </button>
                )}
              </form>
            )}

            <div>
              <h3 className="font-semibold text-lg mb-2">Lessons</h3>
              {lessons.length === 0 ? (
                <p className="text-gray-500">No lessons added yet.</p>
              ) : (
                <ul className="space-y-3">
                  {lessons.map((lesson) => (
                    <li key={lesson.lesson_id} className="p-3 border rounded hover:bg-gray-50 flex flex-col gap-2">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <div>
                          <h4 className="font-medium">{lesson.title}</h4>
                          <p className="text-gray-600 text-sm">{lesson.content}</p>
                          {lesson.thumbnail && (
                            <img
                              src={`${import.meta.env.VITE_API_BASE_URL}${lesson.thumbnail}`}
                              alt="Lesson"
                              className="mt-1 w-full max-w-sm rounded"
                            />
                          )}
                        </div>
                        {role === "instructor" && (
                          <div className="flex gap-2 mt-2 sm:mt-0">
                            <button
                              onClick={() => handleEditLesson(lesson)}
                              className="px-3 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteLesson(lesson.lesson_id)}
                              className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetails;