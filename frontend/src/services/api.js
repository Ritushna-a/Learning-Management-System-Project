import axios from "axios";

const ApiFormData = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

const Api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const authConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
  },
});

export const createUserApi = (data) => Api.post("/api/user/register", data);
export const loginUserApi = (data) => Api.post("/api/user/login", data);
export const forgotPasswordApi = (email) => Api.post("/api/user/forgotpassword", { email });
export const resetPasswordApi = (data) => Api.post(`/api/user/resetpassword`, data);

export const getProfileApi = () => Api.get("/api/user/profile", authConfig());
export const updateProfileApi = (data) => ApiFormData.put("/api/user/profile", data, authConfig());
export const getAllStudentsApi = () => Api.get("/api/user/students", authConfig());

export const createCourseApi = (data) => ApiFormData.post("/api/course", data, authConfig());
export const getCoursesApi = () => Api.get("/api/course", authConfig());
export const deleteCourseApi = (id) => Api.delete(`/api/course/${id}`, authConfig());
export const updateCourseApi = (id, data) => ApiFormData.put(`/api/course/${id}`, data, authConfig());

export const createLessonApi = (data) => Api.post("/api/lesson", data, authConfig());
export const getLessonsApi = (courseId) => Api.get(`/api/lesson/${courseId}`, authConfig());
export const updateLessonApi = (id, data) => Api.put(`/api/lesson/${id}`, data, authConfig());
export const deleteLessonApi = (id) => Api.delete(`/api/lesson/${id}`, authConfig());