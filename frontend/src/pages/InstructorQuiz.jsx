import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import InstructorDashCard from "../component/InstructorDashCard";
import {
  getCoursesApi,
  createQuizApi,
  updateQuizApi,
  deleteQuizApi,
  getQuizzesByCourseApi,
  getQuizDetailsApi,
} from "../services/api";

const emptyQuestion = () => ({
  question: "",
  options: ["", "", "", ""],
  correctAnswer: "",
});

const InstructorQuiz = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [quizzes, setQuizzes] = useState([]);

  const [editingQuizId, setEditingQuizId] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([emptyQuestion()]);
  const [saving, setSaving] = useState(false);

  const canSave = useMemo(() => {
    if (!selectedCourseId || !title.trim() || questions.length === 0) return false;
    return questions.every((q) => {
      const filledOptions = q.options.filter((o) => o.trim());
      return q.question.trim() && filledOptions.length >= 2 && q.correctAnswer.trim();
    });
  }, [selectedCourseId, title, questions]);

  const resetForm = () => {
    setEditingQuizId(null);
    setTitle("");
    setDescription("");
    setQuestions([emptyQuestion()]);
  };

  const fetchCourses = async () => {
    try {
      const { data } = await getCoursesApi();
      if (!data.success) return toast.error(data.message || "Failed to load courses");

      setCourses(data.courses || []);
      if (data.courses?.length > 0) {
        setSelectedCourseId(String(data.courses[0].course_id));
      } else {
        setSelectedCourseId("");
        toast("Create a course first to add quizzes.", { icon: "ℹ️" });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load courses");
    }
  };

  const fetchQuizzes = async (courseId) => {
    if (!courseId) return;
    try {
      const { data } = await getQuizzesByCourseApi(courseId);
      if (!data.success) return toast.error(data.message || "Failed to load quizzes");
      setQuizzes(data.quizzes || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load quizzes");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    fetchQuizzes(selectedCourseId);
    resetForm();
  }, [selectedCourseId]);

  const setQuestionText = (index, value) => {
    const next = [...questions];
    next[index].question = value;
    setQuestions(next);
  };

  const setOptionText = (qIndex, oIndex, value) => {
    const next = [...questions];
    next[qIndex].options[oIndex] = value;

    if (next[qIndex].correctAnswer === questions[qIndex].options[oIndex] && value !== questions[qIndex].options[oIndex]) {
      next[qIndex].correctAnswer = value;
    }

    setQuestions(next);
  };

  const setCorrectAnswer = (index, value) => {
    const next = [...questions];
    next[index].correctAnswer = value;
    setQuestions(next);
  };

  const addQuestion = () => setQuestions((prev) => [...prev, emptyQuestion()]);
  const removeQuestion = (index) => {
    if (questions.length === 1) return;
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!canSave) {
      toast.error("Please fill all required quiz fields correctly");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        courseId: Number(selectedCourseId),
        title: title.trim(),
        description: description.trim(),
        questions: questions.map((q) => ({
          question: q.question.trim(),
          options: q.options.filter((o) => o.trim()).map((o) => o.trim()),
          correctAnswer: q.correctAnswer.trim(),
        })),
      };

      const response = editingQuizId
        ? await updateQuizApi(editingQuizId, payload)
        : await createQuizApi(payload);

      if (!response.data.success) {
        toast.error(response.data.message || "Operation failed");
        return;
      }

      toast.success(editingQuizId ? "Quiz updated" : "Quiz created");
      resetForm();
      fetchQuizzes(selectedCourseId);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save quiz");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (quizId) => {
    try {
      const { data } = await getQuizDetailsApi(quizId);
      if (!data.success) return toast.error(data.message || "Failed to load quiz");

      const quiz = data.quiz;
      setEditingQuizId(quiz.quiz_id);
      setTitle(quiz.title || "");
      setDescription(quiz.description || "");
      setQuestions(
        (quiz.questions || []).map((q) => ({
          question: q.question || "",
          options: Array.isArray(q.options) && q.options.length > 0 ? [...q.options, "", "", "", ""].slice(0, 4) : ["", "", "", ""],
          correctAnswer: q.correctAnswer || "",
        }))
      );
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load quiz for editing");
    }
  };

  const handleDelete = async (quizId) => {
    if (!window.confirm("Delete this quiz?")) return;
    try {
      const { data } = await deleteQuizApi(quizId);
      if (!data.success) return toast.error(data.message || "Delete failed");
      toast.success("Quiz deleted");
      if (editingQuizId === quizId) resetForm();
      fetchQuizzes(selectedCourseId);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row gap-8 p-4 md:p-8">
      <aside className="w-full md:w-80 flex-shrink-0">
        <div className="sticky top-8">
          <InstructorDashCard />
        </div>
      </aside>

      <main className="flex-1 space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Quiz Management</h1>
          <p className="text-slate-500 mt-1">Create, edit and delete quizzes by course.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <label className="block text-sm font-medium text-slate-700 mb-2">Select Course</label>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="w-full md:w-96 border border-slate-300 rounded-lg p-2.5"
          >
            {courses.length === 0 ? (
              <option value="">No courses found</option>
            ) : (
              courses.map((course) => (
                <option key={course.course_id} value={course.course_id}>
                  {course.title}
                </option>
              ))
            )}
          </select>
        </div>

        <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900">{editingQuizId ? "Edit Quiz" : "Create Quiz"}</h2>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Quiz title"
            className="w-full border border-slate-300 rounded-lg p-2.5"
          />

          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Quiz description"
            className="w-full border border-slate-300 rounded-lg p-2.5"
          />

          <div className="space-y-4">
            {questions.map((q, qIndex) => (
              <div key={qIndex} className="border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-slate-800">Question {qIndex + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeQuestion(qIndex)}
                    className="text-red-600 text-sm font-semibold"
                  >
                    Remove
                  </button>
                </div>

                <input
                  type="text"
                  value={q.question}
                  onChange={(e) => setQuestionText(qIndex, e.target.value)}
                  placeholder="Question text"
                  className="w-full border border-slate-300 rounded-lg p-2.5"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {q.options.map((option, oIndex) => (
                    <input
                      key={oIndex}
                      type="text"
                      value={option}
                      onChange={(e) => setOptionText(qIndex, oIndex, e.target.value)}
                      placeholder={`Option ${oIndex + 1}`}
                      className="w-full border border-slate-300 rounded-lg p-2.5"
                    />
                  ))}
                </div>

                <select
                  value={q.correctAnswer}
                  onChange={(e) => setCorrectAnswer(qIndex, e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5"
                >
                  <option value="">Select correct answer</option>
                  {q.options
                    .filter((o) => o.trim())
                    .map((option, idx) => (
                      <option key={idx} value={option}>
                        {option}
                      </option>
                    ))}
                </select>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={addQuestion}
              className="px-4 py-2 rounded-lg border border-indigo-600 text-indigo-600 font-semibold"
            >
              + Add Question
            </button>

            <button
              type="submit"
              disabled={!canSave || saving}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold disabled:opacity-60"
            >
              {saving ? "Saving..." : editingQuizId ? "Update Quiz" : "Create Quiz"}
            </button>

            {editingQuizId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Quizzes</h2>
          {quizzes.length === 0 ? (
            <p className="text-slate-500">No quizzes for this course yet.</p>
          ) : (
            <div className="space-y-3">
              {quizzes.map((quiz) => (
                <div key={quiz.quiz_id} className="border border-slate-200 rounded-lg p-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">{quiz.title}</p>
                    <p className="text-sm text-slate-500">{quiz.description || "No description"}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(quiz.quiz_id)}
                      className="px-3 py-1.5 text-sm font-semibold rounded-lg bg-indigo-50 text-indigo-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(quiz.quiz_id)}
                      className="px-3 py-1.5 text-sm font-semibold rounded-lg bg-red-50 text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default InstructorQuiz;
