import React, { useEffect, useState } from "react";
import InstructorDashCard from "../component/InstructorDashCard";
import { getAllStudentsApi } from "../services/api";

const Student = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await getAllStudentsApi();

      if (Array.isArray(response.data)) {
        setStudents(response.data);
      } else {
        setStudents([]);
        console.warn("getAllStudentsApi returned non-array:", response.data);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  if (loading)
    return (
      <p className="text-gray-500 text-center mt-10 text-lg font-medium">
        Loading students...
      </p>
    );

  if (error)
    return (
      <p className="text-red-500 text-center mt-10 text-lg font-medium">
        {error}
      </p>
    );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <InstructorDashCard />

      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Registered Students
        </h1>

        <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Role
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students.length > 0 ? (
                students.map((student) => (
                  <tr
                    key={student.user_id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-medium">
                      {student.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {student.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          student.role === "student"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {student.role}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center p-4 text-gray-500">
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Student;
