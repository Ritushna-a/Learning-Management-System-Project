import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 pt-20 pb-14">
      <div className="container mx-auto px-10 max-w-6xl">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">
          
          <div className="space-y-6">
            <img
              src="/src/assets/logo.png"
              alt="Logo"
              className="h-10 w-auto"
            />
            <p className="text-slate-500 text-[15px] leading-relaxed font-medium">
              Premium learning experiences designed for the modern era.
              Built for students, by educators.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-12">
            
            <div>
              <h4 className="text-[13px] font-bold text-slate-900 uppercase tracking-widest mb-6">
                Platform
              </h4>
              <ul className="space-y-5 text-[15px] font-semibold text-slate-600">
                <li>
                  <Link
                    to="/courses"
                    className="hover:text-indigo-600 transition-colors"
                  >
                    All Courses
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="hover:text-indigo-600 transition-colors"
                  >
                    Our Mission
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[13px] font-bold text-slate-900 uppercase tracking-widest mb-6">
                Legal
              </h4>
              <ul className="space-y-5 text-[15px] font-semibold text-slate-600">
                <li>
                  <Link
                    to="/"
                    className="hover:text-indigo-600 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="hover:text-indigo-600 transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

          </div>

          <div className="md:text-right">
            <h4 className="text-[13px] font-bold text-slate-900 uppercase tracking-widest mb-6">
              Contact
            </h4>
            <p className="text-[16px] font-semibold text-slate-800">
              support@lmsplatform.com
            </p>
            <p className="text-[14px] text-slate-500 mt-3 font-medium">
              Available Mon - Fri, 9am - 5pm
            </p>
          </div>

        </div>

        <div className="pt-10 border-t border-slate-100 text-center">
          <span className="text-[13px] text-slate-400 font-semibold tracking-wide">
            © {new Date().getFullYear()} LMS Platform — All Rights Reserved
          </span>
        </div>

      </div>
    </footer>
  );
};

export default Footer;