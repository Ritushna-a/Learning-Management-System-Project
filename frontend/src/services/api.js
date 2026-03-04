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
export const deleteStudentApi = (id) => Api.delete(`/api/user/students/${id}`, authConfig());

export const createCourseApi = (data) => ApiFormData.post("/api/course", data, authConfig());
export const getCoursesApi = () => Api.get("/api/course", authConfig());
export const deleteCourseApi = (id) => Api.delete(`/api/course/${id}`, authConfig());
export const updateCourseApi = (id, data) => ApiFormData.put(`/api/course/${id}`, data, authConfig());

export const createLessonApi = (data) => Api.post("/api/lesson", data, authConfig());
export const getLessonsApi = (courseId) => Api.get(`/api/lesson/${courseId}`, authConfig());
export const updateLessonApi = (id, data) => Api.put(`/api/lesson/${id}`, data, authConfig());
export const deleteLessonApi = (id) => Api.delete(`/api/lesson/${id}`, authConfig());

export const getAssignmentsApi = (courseId) => Api.get(`/api/assignment/course/${courseId}`, authConfig());
export const createAssignmentApi = (data) => Api.post("/api/assignment", data, authConfig());
export const updateAssignmentApi = (id, data) => Api.put(`/api/assignment/${id}`, data, authConfig());
export const deleteAssignmentApi = (id) => Api.delete(`/api/assignment/${id}`, authConfig());
export const getSingleAssignmentApi = (id) => Api.get(`/api/assignment/single/${id}`, authConfig());

export const submitAssignmentApi = (data) => Api.post("/api/submission", data, authConfig());
export const getSubmissionsByAssignmentApi = (id) => Api.get(`/api/submission/assignment/${id}`, authConfig());
export const updateGradeApi = (id, data) => Api.put(`/api/submission/grade/${id}`, data, authConfig());

export const getNotificationsApi = () => Api.get("/api/notification", authConfig());
export const markNotificationReadApi = (id) => Api.put(`/api/notification/read/${id}`, {}, authConfig());
export const markAllNotificationsReadApi = () => Api.put("/api/notification/read-all", {}, authConfig());

export const getMyEnrollmentsApi = () => Api.get("/api/enrollment/my-courses", authConfig());
export const enrollInCourseApi = (courseId) => Api.post(`/api/enrollment/${courseId}`, {}, authConfig());
export const unenrollCourseApi = (courseId) => Api.delete(`/api/enrollment/${courseId}`, authConfig());

export const createQuizApi = (data) => Api.post("/api/quiz", data, authConfig());
export const updateQuizApi = (quizId, data) => Api.put(`/api/quiz/${quizId}`, data, authConfig());
export const deleteQuizApi = (quizId) => Api.delete(`/api/quiz/${quizId}`, authConfig());
export const getQuizzesByCourseApi = (courseId) => Api.get(`/api/quiz/course/${courseId}`, authConfig());
export const getQuizDetailsApi = (quizId) => Api.get(`/api/quiz/${quizId}`, authConfig());
export const submitQuizApi = (quizId, data) => Api.post(`/api/quiz/${quizId}/submit`, data, authConfig());
export const getMyQuizResultApi = (quizId) => Api.get(`/api/quiz/${quizId}/my-result`, authConfig());
