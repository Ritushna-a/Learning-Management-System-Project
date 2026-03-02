import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSingleAssignmentApi, createAssignmentApi, updateAssignmentApi } from "../services/api";
import InstructorDashCard from "../component/InstructorDashCard"; 
import toast from "react-hot-toast";
import { FaArrowLeft, FaSave, FaClipboardCheck } from "react-icons/fa";

const CreateAssignment = () => {
  const { courseId, assignmentId } = useParams();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState({
    title: "",
    description: "",
    dueDate: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (assignmentId) {
      const fetchAssignmentData = async () => {
        try {
          const { data } = await getSingleAssignmentApi(assignmentId);
          if (data.success) {
            setAssignment({
              title: data.assignment.title,
              description: data.assignment.description,
              dueDate: data.assignment.due_date ? data.assignment.due_date.slice(0, 10) : "",
            });
          }
        } catch (err) {
          toast.error("Failed to load assignment details");
        }
      };
      fetchAssignmentData();
    }
  }, [assignmentId]);

  const handleChange = (e) => {
    setAssignment({ ...assignment, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (assignmentId) {
        await updateAssignmentApi(assignmentId, assignment);
        toast.success("Assignment updated successfully!");
      } else {
        await createAssignmentApi({ ...assignment, courseId });
        toast.success("Assignment created and linked to course!");
      }
      navigate(`/assignments/${courseId}`);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to save assignment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <InstructorDashCard />

      <div className="flex-1 p-8 lg:p-12">
        <div className="max-w-3xl mx-auto">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium mb-8 transition-colors group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> 
            Back to Course
          </button>

          <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
            <div className="bg-indigo-600 p-8 text-white flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold italic">
                  {assignmentId ? "Edit Task" : "New Assignment"}
                </h1>
                <p className="text-indigo-100 mt-2 opacity-80">
                  Fill in the details to publish work for your students.
                </p>
              </div>
              <FaClipboardCheck size={40} className="opacity-20" />
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">
                  Assignment Title
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g., Introduction to React Hooks"
                  value={assignment.title}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 focus:border-indigo-500 focus:bg-white outline-none transition-all text-slate-800 placeholder:text-slate-300"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">
                  Instructions & Description
                </label>
                <textarea
                  name="description"
                  rows="6"
                  placeholder="What should the students submit? Be specific..."
                  value={assignment.description}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 focus:border-indigo-500 focus:bg-white outline-none transition-all text-slate-800 placeholder:text-slate-300 resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">
                  Submission Deadline
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={assignment.dueDate}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 focus:border-indigo-500 focus:bg-white outline-none transition-all text-slate-800 cursor-pointer"
                />
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className={`w-full ${loading ? 'bg-slate-400' : 'bg-slate-900 hover:bg-indigo-600'} text-white font-bold py-5 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-3 text-lg`}
                >
                  {loading ? (
                    <span className="animate-pulse">Processing...</span>
                  ) : (
                    <>
                      <FaSave /> {assignmentId ? "Save Changes" : "Publish Assignment"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAssignment;