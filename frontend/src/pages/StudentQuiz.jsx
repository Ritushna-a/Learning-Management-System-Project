import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import StudentDashCard from "../component/StudentDashCard";
import {
  getMyEnrollmentsApi,
  getQuizzesByCourseApi,
  getQuizDetailsApi,
  submitQuizApi,
  getMyQuizResultApi,
} from "../services/api";

const StudentQuiz = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState("");
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEnrollments = async () => {
    try {
      const { data } = await getMyEnrollmentsApi();
      if (!data.success) return toast.error(data.message || "Failed to load enrollments");
      setEnrollments(data.enrollments || []);
      if (data.enrollments?.length > 0) {
        setSelectedCourseId(String(data.enrollments[0].course_id));
      }
    } catch {
      toast.error("Failed to load enrollments");
    }
  };

  const fetchQuizzes = async (courseId) => {
    if (!courseId) return;
    try {
      const { data } = await getQuizzesByCourseApi(courseId);
      if (!data.success) return toast.error(data.message || "Failed to load quizzes");
      setQuizzes(data.quizzes || []);
      setSelectedQuizId(data.quizzes?.[0] ? String(data.quizzes[0].quiz_id) : "");
      setQuiz(null);
      setResult(null);
      setFeedback([]);
    } catch {
      toast.error("Failed to load quizzes");
    }
  };

  const fetchQuiz = async (quizId) => {
    if (!quizId) return;
    setLoading(true);
    try {
      const [{ data: quizRes }, resultRes] = await Promise.all([
        getQuizDetailsApi(quizId),
        getMyQuizResultApi(quizId).catch(() => null),
      ]);

      if (!quizRes.success) return toast.error(quizRes.message || "Failed to load quiz");
      setQuiz(quizRes.quiz);
      setAnswers(new Array((quizRes.quiz.questions || []).length).fill(""));
      setResult(resultRes?.data?.success ? resultRes.data.submission : null);
      setFeedback([]);
    } catch {
      toast.error("Failed to load quiz");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  useEffect(() => {
    fetchQuizzes(selectedCourseId);
  }, [selectedCourseId]);

  useEffect(() => {
    fetchQuiz(selectedQuizId);
  }, [selectedQuizId]);

  const onSelectAnswer = (qIndex, option) => {
    const next = [...answers];
    next[qIndex] = option;
    setAnswers(next);
  };

  const handleSubmit = async () => {
    if (!selectedQuizId) return;
    if (answers.some((answer) => !answer)) return toast.error("Please answer all questions");

    try {
      const { data } = await submitQuizApi(selectedQuizId, { answers });
      if (!data.success) return toast.error(data.message || "Failed to submit quiz");
      setResult({ score: data.result.score, total: data.result.total });
      setFeedback(Array.isArray(data.result.feedback) ? data.result.feedback : []);
      toast.success("Quiz submitted successfully");
    } catch {
      toast.error("Failed to submit quiz");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row gap-8 p-4 md:p-8">
      <aside className="w-full md:w-80 flex-shrink-0">
        <div className="sticky top-8">
          <StudentDashCard />
        </div>
      </aside>

      <main className="flex-1 space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Quizzes</h1>
          <p className="text-slate-500 mt-1">Take quizzes from your enrolled courses.</p>
        </div>

        {enrollments.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-slate-500">No enrolled courses found.</div>
        ) : (
          <>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Course</label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5"
                >
                  {enrollments.map((item) => (
                    <option key={item.enrollment_id} value={item.course_id}>
                      {item.Course?.title || `Course ${item.course_id}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Quiz</label>
                <select
                  value={selectedQuizId}
                  onChange={(e) => setSelectedQuizId(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5"
                >
                  {quizzes.length === 0 ? (
                    <option value="">No quizzes available</option>
                  ) : (
                    quizzes.map((quiz) => (
                      <option key={quiz.quiz_id} value={quiz.quiz_id}>
                        {quiz.title}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            {loading ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-slate-500">Loading quiz...</div>
            ) : !quiz ? (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-slate-500">Select a quiz to start.</div>
            ) : (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900">{quiz.title}</h2>
                <p className="text-slate-500 mt-1 mb-6">{quiz.description || "No description"}</p>

                <div className="space-y-4">
                  {(quiz.questions || []).map((q, qIndex) => (
                    <div key={qIndex} className="border border-slate-200 rounded-lg p-4">
                      <p className="font-semibold text-slate-800 mb-2">{qIndex + 1}. {q.question}</p>
                      <div className="space-y-1.5">
                        {(q.options || []).map((option, oIndex) => (
                          <label key={oIndex} className="flex items-center gap-2 text-slate-700">
                            <input
                              type="radio"
                              name={`q-${qIndex}`}
                              checked={answers[qIndex] === option}
                              onChange={() => onSelectAnswer(qIndex, option)}
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>

                      {feedback[qIndex] && (
                        <div className="mt-3">
                          <span
                            className={`inline-block px-2.5 py-1 rounded text-xs font-bold uppercase ${
                              feedback[qIndex].status === "correct"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {feedback[qIndex].status === "correct" ? "Correct" : "Incorrect"}
                          </span>
                          {feedback[qIndex].status === "incorrect" && (
                            <p className="text-xs text-slate-600 mt-2">
                              Correct answer: <span className="font-semibold">{feedback[qIndex].correctAnswer}</span>
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleSubmit}
                    className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
                  >
                    Submit Quiz
                  </button>

                  {result && (
                    <p className="text-sm font-semibold text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded-lg">
                      Score: {result.score} / {result.total}
                    </p>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default StudentQuiz;
