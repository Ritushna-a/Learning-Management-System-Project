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
      console.error("DELETE COURSE ERROR:", error);
      toast.error("Delete failed");
    }
  };

  const handleEnroll = (id) => {
    if (!enrolledCourses.includes(id)) {
      const updated = [...enrolledCourses, id];
      setEnrolledCourses(updated);
      localStorage.setItem("enrolledCourses", JSON.stringify(updated));
      toast.success("You have successfully enrolled in this course!");
    }
  };

  const handleNavigate = (id) => {
    navigate(`/course/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex gap-6 p-6">
      {role === "instructor" ? <InstructorDashCard /> : <StudentDashCard />}

      <div className="flex-1">
        {role === "instructor" && (
          <div className="flex justify-end mb-6">
            <Link
              to="/createcourse"
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
            >
              + Create Course
            </Link>
          </div>
        )}

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {courses.length === 0 && (
            <p className="col-span-full text-center text-gray-500">
              No courses available
            </p>
          )}

          {courses.map((course) => (
            <div
              key={course.course_id}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              {course.thumbnail && (
                <img
                  onClick={() => handleNavigate(course.course_id)}
                  src={`${import.meta.env.VITE_API_BASE_URL}${course.thumbnail}`}
                  alt="Course Thumbnail"
                  className="h-40 w-full object-cover cursor-pointer"
                />
              )}

              <div className="p-4 flex flex-col gap-3">
                <h3
                  onClick={() => handleNavigate(course.course_id)}
                  className="font-semibold text-lg hover:text-blue-600 cursor-pointer"
                >
                  {course.title}
                </h3>

                <p className="text-gray-600 text-sm line-clamp-3">{course.description}</p>

                {role === "instructor" ? (
                  <div className="flex gap-2 mt-3">
                    <Link
                      to={`/createcourse/${course.course_id}`}
                      className="flex-1 text-center bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition text-sm"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(course.course_id)}
                      className="flex-1 text-center bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-sm"
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  <div className="mt-3">
                    <button
                      disabled={enrolledCourses.includes(course.course_id)}
                      onClick={() => handleEnroll(course.course_id)}
                      className={`w-full px-3 py-2 rounded text-sm text-white transition ${
                        enrolledCourses.includes(course.course_id)
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      {enrolledCourses.includes(course.course_id) ? "Enrolled" : "Enroll"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;
