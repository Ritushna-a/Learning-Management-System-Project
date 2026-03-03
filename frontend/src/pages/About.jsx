import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] pt-28 pb-24 px-6">
      <div className="container mx-auto max-w-4xl">
        
        {/* Section Label */}
        <h2 className="text-[14px] font-bold text-indigo-600 uppercase tracking-[0.3em] mb-6">
          Our Story
        </h2>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-10">
          We build tools for the curious.
        </h1>

        {/* Description */}
        <div className="space-y-8 text-slate-600 text-[18px] leading-relaxed font-medium max-w-3xl">
          <p>
            This platform was built on a simple premise: learning shouldn't be complicated.
            We've removed the noise to focus on meaningful interaction between teachers and students.
          </p>
          <p>
            Whether you're an instructor managing a classroom or a student 
            leveling up your skills, our interface stays out of your way —
            so you can focus on what matters most: growth.
          </p>
        </div>

        {/* Core Principles Card */}
        <div className="mt-16 p-12 bg-white border border-slate-200 rounded-3xl shadow-sm">
          
          <h3 className="text-2xl font-bold text-slate-900 mb-10">
            Core Principles
          </h3>

          <ul className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {[
              "Clarity First",
              "Student Centric",
              "Open Feedback",
              "Privacy Driven"
            ].map((item, index) => (
              <li
                key={index}
                className="flex items-center gap-3 text-[16px] text-slate-600 font-semibold"
              >
                <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                {item}
              </li>
            ))}

          </ul>
        </div>

      </div>
    </div>
  );
};

export default About;