import React from "react";
import StudentDashCard from "../component/StudentDashCard";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row gap-8 p-4 md:p-8">
      <aside className="w-full md:w-80 flex-shrink-0">
        <div className="sticky top-8">
          <StudentDashCard />
        </div>
      </aside>

      <div className="flex-1 space-y-6">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Student Dashboard
            </h1>
            <p className="text-slate-600 max-w-lg leading-relaxed">
              Welcome back! Here you can track your learning journey, 
              manage your enrolled courses, and pick up right where you left off.
            </p>
            <button 
              onClick={() => navigate("/courses")}
              className="mt-6 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all text-sm"
            >
              Explore Courses
            </button>
          </div>
          
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-60"></div>
        </div>
        
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm border-dashed flex flex-col items-center justify-center min-h-[300px] text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">📚</span>
          </div>
          <h3 className="text-lg font-bold text-slate-800">No active courses yet</h3>
          <p className="text-slate-500 text-sm mt-1 max-w-xs">
            Start your learning journey by enrolling in a course from the catalog.
          </p>
          <button 
            onClick={() => navigate("/courses")}
            className="mt-4 text-indigo-600 font-bold text-sm hover:underline"
          >
            Browse the Course Catalog →
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
