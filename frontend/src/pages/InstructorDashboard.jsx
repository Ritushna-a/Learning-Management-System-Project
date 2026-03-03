import React, { useEffect, useState } from "react";
import InstructorDashCard from "../component/InstructorDashCard";
import { getCoursesApi, getAllStudentsApi } from "../services/api";
import { FaUsers, FaBookOpen, FaClipboardCheck, FaPlus, FaChalkboardTeacher } from "react-icons/fa";
import { getUser } from "../protected/Auth";
import { useNavigate, Link } from "react-router-dom";

const InstructorDashboard = () => {
  const [stats, setStats] = useState({ courses: 0, students: 0, pending: 0 });
  const navigate = useNavigate();
  const user = getUser();
  const firstName = user?.username || "Instructor";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const courseRes = await getCoursesApi();
        const studentRes = await getAllStudentsApi();
        setStats({
          courses: courseRes.data.courses?.length || 0,
          students: studentRes.data?.length || 0,
          pending: 0 
        });
      } catch (err) { console.error(err); }
    };
    fetchStats();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row gap-8 p-6 md:p-10">
      <aside className="w-full md:w-80 flex-shrink-0">
        <InstructorDashCard />
      </aside>

      <main className="flex-1 space-y-6">
        <div className="relative bg-slate-900 rounded-[2rem] p-8 md:p-10 text-white shadow-xl overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-indigo-500/20 transition-all duration-700"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-4xl font-black tracking-tight leading-tight">
                {getGreeting()}, {firstName}.
              </h1>
              <p className="text-slate-400 mt-2 text-sm md:text-base font-medium max-w-sm">
                Your curriculum is performing well. You have {stats.students} active students today.
              </p>
            </div>
            
            <div className="hidden lg:flex items-center justify-center w-28 h-28 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 -rotate-3 group-hover:rotate-0 transition-transform duration-500">
               <FaChalkboardTeacher className="text-white/10 text-5xl" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatBox icon={<FaBookOpen />} label="Total Courses" value={stats.courses} color="bg-indigo-50 text-indigo-600" />
          <StatBox icon={<FaUsers />} label="Active Students" value={stats.students} color="bg-emerald-50 text-emerald-600" />
          <StatBox icon={<FaClipboardCheck />} label="Pending Grades" value={stats.pending} color="bg-amber-50 text-amber-600" />
        </div>

        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm min-h-[300px]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-black text-xl text-slate-900 tracking-tight">Management</h3>
              <p className="text-slate-400 text-sm font-medium">Quick overview of your published content</p>
            </div>
            <Link 
              to="/createcourse"
              className="bg-slate-900 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg active:scale-95 flex items-center gap-2"
            >
              <FaPlus /> Create New
            </Link>
          </div>
          
          {stats.courses === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-slate-50 rounded-[2rem] bg-slate-50/50">
               <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
                  <FaBookOpen className="text-slate-200 text-2xl" />
               </div>
               <p className="text-slate-400 font-bold text-sm">No courses published yet.</p>
            </div>
          ) : (
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <p className="text-slate-500 text-sm font-medium italic">Your courses are currently live. Head to the "Courses" tab to manage lessons.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const StatBox = ({ icon, label, value, color }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-50 shadow-sm flex items-center gap-5 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
      <p className="text-2xl font-black text-slate-900 leading-none">{value}</p>
    </div>
  </div>
);

export default InstructorDashboard;
