import { useEffect, useState } from "react";
import { getCoursesApi, deleteCourseApi } from "../services/api";
import { getUserRole } from "../protected/Auth";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import InstructorDashCard from "../component/InstructorDashCard";
import StudentDashCard from "../component/StudentDashCard";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState(() => {
    const saved = localStorage.getItem("enrolledCourses");
    return saved ? JSON.parse(saved) : [];
  });

  const role = getUserRole();
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      const { data } = await getCoursesApi();
      if (data.success) setCourses(data.courses);
      else toast.error(data.message || "Failed to load courses");
    } catch (error) {
      console.error("FETCH COURSES ERROR:", error);
      toast.error("Failed to load courses");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      const { data } = await deleteCourseApi(id);
      if (data.success) {
        setCourses(courses.filter((c) => c.course_id !== id));
        toast.success("Course deleted successfully");
      } else toast.error(data.message || "Delete failed");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const handleEnroll = (id) => {
    if (!enrolledCourses.includes(id)) {
      const updated = [...enrolledCourses, id];
      setEnrolledCourses(updated);
      localStorage.setItem("enrolledCourses", JSON.stringify(updated));
      toast.success("Enrolled successfully!");
    }
  };

  const handleUnenroll = (id) => {
    if (!window.confirm("Unenroll from this course?")) return;
    const updated = enrolledCourses.filter((courseId) => courseId !== id);
    setEnrolledCourses(updated);
    localStorage.setItem("enrolledCourses", JSON.stringify(updated));
    toast.success("Unenrolled successfully.");
  };

  const handleNavigate = (id) => {
    if (role === "student" && !enrolledCourses.includes(id)) {
      toast.error("Please enroll to view course content");
      return;
    }
    navigate(`/course/${id}`);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row gap-8 p-4 md:p-8">
      <aside className="w-full md:w-80 flex-shrink-0">
        <div className="sticky top-8">
          {role === "instructor" ? <InstructorDashCard /> : <StudentDashCard />}
        </div>
      </aside>

      <main className="flex-1">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Explore Courses</h1>
            <p className="text-slate-500 mt-1">Enhance your skills with our latest programs.</p>
          </div>

          {role === "instructor" && (
            <Link
              to="/createcourse"
              className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 shadow-sm transition-all active:scale-95"
            >
              + Create New Course
            </Link>
          )}
        </div>
        {courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">No courses found in the library.</p>
          </div>
        ) : (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => {
              const isEnrolled = enrolledCourses.includes(course.course_id);
              const isStudent = role === "student";

              return (
                <div
                  key={course.course_id}
                  className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300"
                >
                  <div className="relative aspect-video overflow-hidden bg-slate-100">
                    {course.thumbnail && (
                      <img
                        onClick={() => handleNavigate(course.course_id)}
                        src={`${import.meta.env.VITE_API_BASE_URL}${course.thumbnail}`}
                        alt={course.title}
                        className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${isStudent && !isEnrolled ? "cursor-not-allowed grayscale-[40%]" : "cursor-pointer"
                          }`}
                      />
                    )}
                    {isEnrolled && isStudent && (
                      <span className="absolute top-3 left-3 bg-green-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md shadow-lg">
                        Enrolled
                      </span>
                    )}
                  </div>

                  <div className="p-5">
                    <h3
                      onClick={() => handleNavigate(course.course_id)}
                      className={`font-bold text-lg leading-tight mb-2 line-clamp-1 transition-colors ${isStudent && !isEnrolled
                          ? "text-slate-400 cursor-not-allowed"
                          : "text-slate-800 cursor-pointer group-hover:text-indigo-600"
                        }`}
                    >
                      {course.title}
                    </h3>

                    <p className="text-slate-500 text-sm line-clamp-2 mb-6 h-10">
                      {course.description}
                    </p>

                    {role === "instructor" ? (
                      <div className="flex gap-3">
                        <Link
                          to={`/createcourse/${course.course_id}`}
                          className="flex-1 text-center py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(course.course_id)}
                          className="flex-1 text-center py-2 text-sm font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition"
                        >
                          Delete
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {isEnrolled ? (
                          <>
                            <button
                              onClick={() => handleNavigate(course.course_id)}
                              className="flex-[2] py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition"
                            >
                              Go to Course
                            </button>
                            <button
                              onClick={() => handleUnenroll(course.course_id)}
                              className="flex-1 py-2.5 text-slate-400 hover:text-red-500 text-xs font-medium transition"
                            >
                              Unenroll
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleEnroll(course.course_id)}
                            className="w-full py-2.5 bg-white border-2 border-indigo-600 text-indigo-600 rounded-lg text-sm font-bold hover:bg-indigo-600 hover:text-white transition-all duration-200"
                          >
                            Enroll Now
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Courses;
