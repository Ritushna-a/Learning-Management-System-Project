import React from "react";
import StudentDashCard from "../component/StudentDashCard";

const StudentDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6 flex gap-6">
      <StudentDashCard />

      <div className="flex-1 bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-semibold mb-4">
          Student Dashboard
        </h1>

        <p className="text-gray-600">
          Welcome back! Here you can view your enrolled courses,
          assignments, and progress.
        </p>

      </div>
    </div>
  );
};

export default StudentDashboard;
