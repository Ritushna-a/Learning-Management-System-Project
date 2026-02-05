import React from "react";
import InstructorDashCard from "../component/InstructorDashCard";

const InstructorDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6 flex gap-6">
      <InstructorDashCard />

      <div className="flex-1 bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-semibold mb-4">Instructor Dashboard</h1>
        <p className="text-gray-600">
          Manage your courses, assignments, and students from here.
        </p>
      </div>
    </div>
  );
};

export default InstructorDashboard;
