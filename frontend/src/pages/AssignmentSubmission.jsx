import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSubmissionsByAssignmentApi, updateGradeApi } from "../services/api";
import toast from "react-hot-toast";

const AssignmentSubmissions = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [courseId, setCourseId] = useState(null);

  const fetchSubmissions = async () => {
    try {
      const { data } = await getSubmissionsByAssignmentApi(assignmentId);
      if (data.success) {
        setSubmissions(data.submissions);
        if (data.submissions.length > 0) {
          setCourseId(data.submissions[0].Assignment?.course_id);
        }
      }
    } catch (err) {
      toast.error("Error loading submissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [assignmentId]);

  const handleGradeSubmit = async (submissionId, grade, feedback) => {
    try {
      const { data } = await updateGradeApi(submissionId, { grade, feedback });
      if (data.success) {
        toast.success("Grade updated successfully");
        fetchSubmissions(); 
      }
    } catch (err) {
      toast.error("Failed to update grade");
    }
  };

  if (loading) return <div className="p-10 text-center font-bold">Loading submissions...</div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 text-black">
      <div className="max-w-5xl mx-auto">
        
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-bold transition-all"
          >
            <span className="text-xl">←</span> Back to Course Details
          </button>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Grading Dashboard</h2>
          <p className="text-slate-500 text-sm mt-1">
            Viewing all student submissions for Assignment #{assignmentId}
          </p>
        </div>

        <div className="space-y-6">
          {submissions.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-300 text-center">
              <p className="text-slate-400 font-medium">No students have submitted work for this assignment yet.</p>
            </div>
          ) : (
            submissions.map((sub) => (
              <div key={sub.submission_id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h4 className="font-bold text-lg text-slate-800">{sub.student?.username}</h4>
                    <p className="text-xs text-slate-400">{sub.student?.email}</p>
                  </div>
                  <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500 font-mono">
                    ID: {sub.submission_id}
                  </span>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
                  <p className="text-xs font-bold text-indigo-500 uppercase mb-2">Student Submission:</p>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                    {sub.content}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div className="md:col-span-1">
                    <label className="block text-xs font-bold text-slate-500 mb-1">GRADE (A, B, 90%, etc.)</label>
                    <input 
                      type="text" 
                      defaultValue={sub.grade}
                      placeholder="Enter grade"
                      onBlur={(e) => handleGradeSubmit(sub.submission_id, e.target.value, sub.feedback)}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  </div>
                  <div className="md:col-span-2 flex gap-2">
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-slate-500 mb-1">INSTRUCTOR FEEDBACK</label>
                      <input 
                        type="text" 
                        defaultValue={sub.feedback}
                        placeholder="Add feedback for the student..."
                        onBlur={(e) => handleGradeSubmit(sub.submission_id, sub.grade, e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-[10px] text-slate-400 italic">
                  Changes save automatically when you click away from the input fields.
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentSubmissions;
