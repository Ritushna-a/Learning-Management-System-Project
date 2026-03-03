import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  return (
    <div className="bg-white min-h-screen text-slate-800">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-40 px-6">
        <div className="container mx-auto max-w-6xl text-center">

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight mb-10 text-slate-900">
            Learn from the{" "}
            <span className="text-indigo-600 font-semibold">
              very best.
            </span>
          </h1>

          <p className="text-[20px] md:text-[22px] text-slate-500 mb-14 max-w-3xl mx-auto leading-relaxed font-medium">
            A refined learning experience for modern students.
            Streamlined, secure, and built for growth.
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            <button
              onClick={() => navigate(token ? "/courses" : "/register")}
              className="bg-slate-900 text-white text-[16px] font-semibold px-12 py-4 rounded-full hover:bg-slate-800 transition shadow-lg"
            >
              Start Learning
            </button>

            <button
              onClick={() => navigate("/courses")}
              className="bg-white text-slate-900 border border-slate-300 text-[16px] font-semibold px-12 py-4 rounded-full hover:bg-slate-50 transition"
            >
              Browse Catalog
            </button>
          </div>
        </div>

        {/* Background Glow */}
        <div className="absolute inset-0 -z-10 opacity-40 pointer-events-none">
          <div className="absolute top-24 left-20 w-80 h-80 bg-indigo-100 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-[28rem] h-[28rem] bg-slate-100 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-28 border-t border-slate-100 bg-[#f8fafc]">
        <div className="container mx-auto px-6 max-w-6xl">

          <div className="grid md:grid-cols-3 gap-12">

            {/* Feature 1 */}
            <div className="p-8 bg-white rounded-2xl border border-slate-200 hover:shadow-md transition">
              <span className="text-3xl mb-6 block text-indigo-600">✦</span>
              <h3 className="text-xl font-bold mb-4 text-slate-900">
                Expert Instruction
              </h3>
              <p className="text-slate-500 leading-relaxed text-[15px] font-medium">
                Courses designed by industry veterans with years of practical experience.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 bg-white rounded-2xl border border-slate-200 hover:shadow-md transition">
              <span className="text-3xl mb-6 block text-indigo-600">✦</span>
              <h3 className="text-xl font-bold mb-4 text-slate-900">
                Seamless Flow
              </h3>
              <p className="text-slate-500 leading-relaxed text-[15px] font-medium">
                Switch between lessons and assignments without losing your place.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 bg-white rounded-2xl border border-slate-200 hover:shadow-md transition">
              <span className="text-3xl mb-6 block text-indigo-600">✦</span>
              <h3 className="text-xl font-bold mb-4 text-slate-900">
                Global Community
              </h3>
              <p className="text-slate-500 leading-relaxed text-[15px] font-medium">
                Join thousands of students achieving their career milestones daily.
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;