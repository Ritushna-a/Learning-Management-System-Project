import React, { useEffect, useState } from "react";
import InstructorDashCard from "../component/InstructorDashCard";
import { getAllStudentsApi, deleteStudentApi } from "../services/api";
import toast from "react-hot-toast";

const Student = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllStudentsApi();
      const data = response.data;

      if (Array.isArray(data)) {
        setStudents(data);
      } else if (data?.success && Array.isArray(data.students)) {
        setStudents(data.students);
      } else {
        setStudents([]);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async (studentId, username) => {
    const ok = window.confirm(`Delete student ${username}?`);
    if (!ok) return;

    try {
      setDeletingId(studentId);
      const { data } = await deleteStudentApi(studentId);
      if (data?.success) {
        toast.success("Student deleted");
        setStudents((prev) => prev.filter((student) => student.user_id !== studentId));
      }
    } catch (err) {
      toast.error("Failed to delete student");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-900 text-2xl font-black tracking-tighter animate-pulse">LOADING...</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-red-600 text-xl font-bold uppercase">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row gap-6 p-6 md:p-10 font-sans">
      <aside className="w-full md:w-72 flex-shrink-0">
        <div className="sticky top-10">
          <InstructorDashCard />
        </div>
      </aside>

      <main className="flex-1 space-y-6">
        <header className="border-b border-slate-200 pb-6">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Registered Students
          </h1>
          <p className="text-slate-500 text-lg font-medium mt-1">
            Manage your learners and view their active enrollments.
          </p>
        </header>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-slate-900">
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Student Name</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Email Address</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Enrolled Courses</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Access Role</th>
                  <th className="px-6 py-4 text-center text-xs font-black text-slate-400 uppercase tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.length > 0 ? (
                  students.map((student) => {
                    const enrollments = Array.isArray(student.Enrollments) ? student.Enrollments : (student.enrollments || []);
                    const enrolledCourses = enrollments.map((e) => e?.Course?.title || e?.course?.title).filter(Boolean);

                    return (
                      <tr key={student.user_id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-5 whitespace-nowrap text-slate-900 font-extrabold text-base">
                          {student.username}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-slate-600 font-semibold">
                          {student.email}
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-wrap gap-2">
                            {enrolledCourses.length > 0 ? (
                              enrolledCourses.map((course, idx) => (
                                <span key={idx} className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-[11px] font-bold border border-slate-200">
                                  {course}
                                </span>
                              ))
                            ) : (
                              <span className="text-slate-400 italic text-sm">No courses</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded text-[10px] font-black uppercase tracking-wider ${
                            student.role === "student" ? "bg-blue-600 text-white" : "bg-teal-600 text-white"
                          }`}>
                            {student.role}
                          </span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-center">
                          <button
                            onClick={() => handleDelete(student.user_id, student.username)}
                            disabled={deletingId === student.user_id}
                            className="px-4 py-2 rounded bg-red-600 text-white text-[11px] font-black uppercase tracking-tighter hover:bg-red-700 transition-all disabled:opacity-50"
                          >
                            {deletingId === student.user_id ? "..." : "Delete"}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest">No Records</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Student;
