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
    <div className="min-h-screen bg-gray-100 flex gap-6 p-6">
      {role === "instructor" && <InstructorDashCard />}

      <div className="flex-1">
        <div className="p-6 bg-white rounded-lg shadow max-w-5xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">
            {isEdit ? "Edit Course" : "Create Course"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-4">
                <div>
                  <label className="block text-sm font-medium">
                    Course Title
                  </label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 p-2 border rounded w-full"
                    placeholder="Course title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">
                    Course Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 p-2 border rounded w-full h-28"
                    placeholder="Course description"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Thumbnail
                </label>
                <div className="border-2 border-dashed rounded p-4 text-center">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="h-40 w-full object-cover rounded mb-2"
                    />
                  ) : (
                    <p className="text-sm text-gray-400">
                      Upload course thumbnail
                    </p>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              {isEdit && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              )}

              <button
                type="submit"
                className="bg-black text-white px-6 py-2 rounded"
              >
                {isEdit ? "Save Changes" : "Create Course"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;
