import React from "react";
import StudentDashCard from "../component/StudentDashCard";
import { useNavigate } from "react-router-dom";
import { FaGraduationCap, FaRocket } from "react-icons/fa";
import { getUser } from "../protected/Auth";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const user = getUser();
  
  const firstName = user?.username || "Student";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row gap-6 p-6 md:p-8">
      <aside className="w-full md:w-72 flex-shrink-0">
        <StudentDashCard />
      </aside>

      <main className="flex-1 space-y-6">
        <div className="relative bg-slate-900 rounded-[1.5rem] p-6 md:p-8 text-white overflow-hidden group border border-slate-800">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-5 -mt-5"></div>
          
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight">
                {getGreeting()}, {firstName}.
              </h1>
              <p className="text-slate-400 mt-1 text-xs md:text-sm font-medium">
                Pick up right where you left off.
              </p>
            </div>
            
            <div className="hidden sm:flex items-center justify-center w-16 h-16 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 rotate-3">
               <FaGraduationCap className="text-white/20 text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-[1.5rem] border border-slate-200/60 shadow-sm flex flex-col items-center justify-center min-h-[350px] text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl border border-slate-100 shadow-sm">
              <FaRocket className="text-slate-300" />
            </div>
          </div>
          
          <h3 className="text-lg font-black text-slate-900 tracking-tight">Your learning shelf is empty</h3>
          <p className="text-slate-500 text-xs md:text-sm mt-2 max-w-xs font-medium leading-relaxed">
            Discover premium courses curated for your professional growth.
          </p>
          <button 
            onClick={() => navigate("/courses")}
            className="mt-6 px-8 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.15em] rounded-xl hover:bg-indigo-600 transition-all active:scale-95 shadow-md"
          >
            Browse the Course Catalog →
          </button>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
