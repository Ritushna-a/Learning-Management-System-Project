import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { createCourseApi, updateCourseApi, getCoursesApi, deleteCourseApi, } from "../services/api";

import InstructorDashCard from "../component/InstructorDashCard";
import { getUserRole } from "../protected/Auth";

const CreateCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const role = getUserRole();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (!id) return;
    setIsEdit(true);

    const loadCourse = async () => {
      try {
        const { data } = await getCoursesApi();
        const course = data.courses.find(
          (c) => c.course_id === Number(id)
        );

        if (!course) {
          toast.error("Course not found");
          navigate("/courses");
          return;
        }

        setTitle(course.title);
        setDescription(course.description);
        setPreview(
          course.thumbnail
            ? `${import.meta.env.VITE_API_BASE_URL}${course.thumbnail}`
            : null
        );
      } catch (error) {
        console.error(error);
        toast.error("Failed to load course");
      }
    };

    loadCourse();
  }, [id, navigate]);

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setThumbnail(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description) {
      return toast.error("Title and description required");
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      if (thumbnail) formData.append("thumbnail", thumbnail);

      if (isEdit) {
        const { data } = await updateCourseApi(id, formData);
        data.success
          ? toast.success("Course updated successfully")
          : toast.error(data.message || "Update failed");
      } else {
        const { data } = await createCourseApi(formData);
        data.success
          ? toast.success("Course created successfully")
          : toast.error(data.message || "Creation failed");
      }

      navigate("/courses");
    } catch (error) {
      console.error(error);
      toast.error("Operation failed");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      const { data } = await deleteCourseApi(id);
      if (data.success) {
        toast.success("Course deleted successfully");
        navigate("/courses");
      } else {
        toast.error(data.message || "Delete failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row gap-8 p-4 md:p-8">
      <aside className="w-full md:w-80 flex-shrink-0">
        <div className="sticky top-8">
          {role === "instructor" && <InstructorDashCard />}
        </div>
      </aside>

      <div className="flex-1">
        <div className="max-w-4xl bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-2xl font-bold text-slate-900">
              {isEdit ? "Edit Course Details" : "Create New Course"}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Configure your course title, description, and cover image.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Course Title
                  </label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                    placeholder="e.g. Master React in 30 Days"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Course Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all h-44 placeholder:text-slate-400"
                    placeholder="Provide a detailed overview of the curriculum..."
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-700">
                  Course Cover
                </label>
                <div className="relative group cursor-pointer">
                  <div className={`border-2 border-dashed rounded-2xl h-64 flex flex-col items-center justify-center bg-slate-50 transition-all ${preview ? 'border-indigo-300' : 'border-slate-300 hover:border-indigo-400'}`}>
                    {preview ? (
                      <div className="relative w-full h-full rounded-2xl overflow-hidden">
                        <img
                          src={preview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-xs font-bold bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30">
                            Change Image
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center p-4">
                        <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-3 border border-slate-100">
                          <span className="text-2xl text-slate-400 font-light">+</span>
                        </div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Upload Thumbnail</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 text-center uppercase font-bold tracking-tighter">
                  Recommended size: 1280x720
                </p>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between">
              <div>
                {isEdit && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="text-red-500 hover:text-red-600 font-bold text-sm transition-colors flex items-center gap-2 group"
                  >
                    <span className="group-hover:rotate-12 transition-transform">🗑️</span> Delete Course
                  </button>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate("/courses")}
                  className="px-6 py-2.5 text-slate-500 font-bold text-sm hover:text-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all text-sm"
                >
                  {isEdit ? "Update Course" : "Create Course"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;
