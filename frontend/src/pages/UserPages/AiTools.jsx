import { useState } from "react";
import useAiStore from "../../store/useAiStore";
import AuthLayout from "../../components/authLayout";

export default function AiTools() {
  const [tab, setTab] = useState("coverLetter");
  const {
    coverLetter,
    highlights,
    resumeFeedback,
    interviewQuestions,
    generateCoverLetter,
    getResumeFeedback,
    getInterviewQuestions,
    loading,
    resetAiState,
  } = useAiStore();

  const [form, setForm] = useState({
    role: "",
    company: "",
    resumeText: "",
    tone: "professional",
    extraPoints: "",
    jobDescription: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleGenerate = async () => {
    resetAiState();
    if (tab === "coverLetter") await generateCoverLetter(form);
    else if (tab === "resumeFeedback")
      await getResumeFeedback({
        resumeText: form.resumeText,
        jobDescription: form.jobDescription,
      });
    else if (tab === "interviewQuestions")
      await getInterviewQuestions({
        role: form.role,
        company: form.company,
      });
  };

  return (
    <AuthLayout>
      <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 transition-all duration-500">
        {/* Title */}
        <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          ✨ AI Career Tools
        </h2>

        {/* Tabs */}
        <div className="flex justify-center gap-3 mb-8">
          {[
            { id: "coverLetter", label: "Cover Letter" },
            { id: "resumeFeedback", label: "Resume Feedback" },
            { id: "interviewQuestions", label: "Interview Questions" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 
                ${
                  tab === item.id
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md"
                    : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700"
                }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Input Section */}
        <div className="space-y-5">
          {(tab === "coverLetter" || tab === "interviewQuestions") && (
            <>
              <input
                name="role"
                placeholder="Job Role"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                           bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-2 
                           focus:ring-indigo-500 outline-none"
                value={form.role}
                onChange={handleChange}
              />
              <input
                name="company"
                placeholder="Company"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                           bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-2 
                           focus:ring-indigo-500 outline-none"
                value={form.company}
                onChange={handleChange}
              />
            </>
          )}

          {tab === "coverLetter" && (
            <>
              <textarea
                name="resumeText"
                placeholder="Paste your resume text here"
                rows="4"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                           bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-2 
                           focus:ring-indigo-500 outline-none"
                value={form.resumeText}
                onChange={handleChange}
              />
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  name="tone"
                  placeholder="Tone (e.g. professional, friendly)"
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                             bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-2 
                             focus:ring-indigo-500 outline-none"
                  value={form.tone}
                  onChange={handleChange}
                />
                <input
                  name="extraPoints"
                  placeholder="Extra points to highlight"
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                             bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-2 
                             focus:ring-indigo-500 outline-none"
                  value={form.extraPoints}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          {tab === "resumeFeedback" && (
            <>
              <textarea
                name="resumeText"
                placeholder="Paste your resume text here"
                rows="4"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                           bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-2 
                           focus:ring-indigo-500 outline-none"
                value={form.resumeText}
                onChange={handleChange}
              />
              <textarea
                name="jobDescription"
                placeholder="Paste the job description here"
                rows="4"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
                           bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-2 
                           focus:ring-indigo-500 outline-none"
                value={form.jobDescription}
                onChange={handleChange}
              />
            </>
          )}
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className={`w-full mt-6 py-3 rounded-lg font-semibold text-white 
                     transition-all duration-300 ${
                       loading
                         ? "bg-indigo-400 cursor-not-allowed"
                         : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90"
                     }`}
        >
          {loading ? "Generating..." : "Generate ✨"}
        </button>

        {/* Output Section */}
        <div className="mt-8 space-y-6">
          {tab === "coverLetter" && coverLetter && (
            <>
              <div className="p-5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                <h3 className="font-semibold mb-2 text-lg">📄 Cover Letter</h3>
                <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  {coverLetter}
                </p>
              </div>

              {highlights.length > 0 && (
                <div className="p-5 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700">
                  <h4 className="font-semibold mb-2">✨ Highlights</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    {highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          {tab === "resumeFeedback" && resumeFeedback && (
            <div className="p-5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
              <h3 className="font-semibold mb-2 text-lg">📋 Resume Feedback</h3>
              <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                {resumeFeedback}
              </p>
            </div>
          )}

          {tab === "interviewQuestions" && interviewQuestions && (
            <div className="p-5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
              <h3 className="font-semibold mb-2 text-lg">
                🎤 Interview Questions
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 dark:text-gray-300">
                {interviewQuestions.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    </AuthLayout>
  );
}
