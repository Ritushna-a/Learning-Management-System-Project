import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAssignmentsApi, deleteAssignmentApi } from "../services/api";
import InstructorDashCard from "../component/InstructorDashCard"; 
import toast from "react-hot-toast";
import { FaPlus, FaCalendarAlt, FaEdit, FaTrash } from "react-icons/fa";

const Assignment = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (courseId) fetchAssignments();
  }, [courseId]);

  const fetchAssignments = async () => {
    try {
      const { data } = await getAssignmentsApi(courseId);
      setAssignments(data.assignments || []);
    } catch (err) {
      toast.error("Error loading assignments");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <InstructorDashCard /> {}

      <div className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">Assignments</h1>
              <p className="text-slate-500 mt-1">Manage tasks and deadlines for this course</p>
            </div>
            <button
              onClick={() => navigate(`/createassignment/${courseId}`)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-100"
            >
              <FaPlus /> New Assignment
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
               <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            </div>
          ) : assignments.length === 0 ? (
            <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-medium text-lg">No assignments found for this course.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {assignments.map((a) => (
                <div key={a.assignment_id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all flex justify-between items-center group">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                      {a.title}
                    </h3>
                    <p className="text-slate-500 line-clamp-2 mb-4 max-w-2xl">{a.description}</p>
                    <div className="flex items-center gap-2 text-rose-500 bg-rose-50 w-fit px-4 py-1.5 rounded-full text-sm font-bold">
                      <FaCalendarAlt size={12} />
                      Due: {new Date(a.due_date).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-6">
                    <button 
                      onClick={() => navigate(`/createassignment/${courseId}/${a.assignment_id}`)}
                      className="p-4 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all"
                    >
                      <FaEdit size={20} />
                    </button>
                    <button className="p-4 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all">
                      <FaTrash size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Assignment;
