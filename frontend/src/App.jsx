import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home";
import About from "./pages/About";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Forgotpassword from "./pages/Forgotpassword";
import ResetPassword from "./pages/ResetPassword";
import StudentDashboard from "./pages/StudentDashboard";
import InstructorDashboard from "./pages/InstructorDashboard";
import Profile from './pages/Profile';
import CreateCourse from "./pages/CreateCourse";
import Courses from "./pages/Courses";
import Student from "./pages/Student";
import CourseDetails from "./pages/CourseDetails";
import Assignment from "./pages/Assignment";
import CreateAssignment from "./pages/CreateAssignment";
import AssignmentSubmissions from "./pages/AssignmentSubmission";
import StudentQuiz from "./pages/StudentQuiz";
import InstructorQuiz from "./pages/InstructorQuiz";

import Header from './component/Header';
import Footer from './component/Footer';
import ProtectedRoute from "./protected/ProtectedRoute";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Toaster />
        <Header />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgotpassword" element={<Forgotpassword />} />
            <Route path="/resetpassword/:token" element={<ResetPassword />} />

            <Route path="/studentdashboard" element={<ProtectedRoute allowedRoles={["student"]} element={<StudentDashboard />} />} />
            <Route path="/student/quizzes" element={<ProtectedRoute allowedRoles={["student"]} element={<StudentQuiz />} />} />
            <Route path="/profile" element={<ProtectedRoute allowedRoles={["student", "instructor"]} element={<Profile />} />} />

            <Route path="/instructordashboard" element={<ProtectedRoute allowedRoles={["instructor"]} element={<InstructorDashboard />} />} />
            <Route path="/instructor/quizzes" element={<ProtectedRoute allowedRoles={["instructor"]} element={<InstructorQuiz />} />} />
            <Route path="/students" element={<ProtectedRoute allowedRoles={["instructor"]} element={<Student />} />} />
            <Route path="/createcourse" element={<ProtectedRoute allowedRoles={["instructor"]} element={<CreateCourse />} />} />
            <Route path="/createcourse/:id" element={<ProtectedRoute allowedRoles={["instructor"]} element={<CreateCourse />} />} />

            <Route path="/courses" element={<ProtectedRoute allowedRoles={["student", "instructor"]} element={<Courses />} />} />
            <Route path="/course/:id" element={<ProtectedRoute allowedRoles={["student", "instructor"]} element={<CourseDetails />} />} />
            
            <Route path="/assignments/:courseId" element={<ProtectedRoute allowedRoles={["student", "instructor"]} element={<Assignment />} />} />
            <Route path="/createassignment/:courseId" element={<ProtectedRoute allowedRoles={["instructor"]} element={<CreateAssignment />} />} />
            <Route path="/createassignment/:courseId/:assignmentId" element={<ProtectedRoute allowedRoles={["instructor"]} element={<CreateAssignment />} />} />
            <Route path="/submissions/:assignmentId" element={<ProtectedRoute allowedRoles={["instructor"]} element={<AssignmentSubmissions />} />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;