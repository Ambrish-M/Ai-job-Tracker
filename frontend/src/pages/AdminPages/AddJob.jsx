import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AuthLayout from "../../components/authLayout";
import useJobStore from "../../store/useJobStore";

const jobTitleOptions = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Product Manager",
  "Data Scientist",
  "UX Designer",
  "QA Engineer",
  "DevOps Engineer",
];

const companyOptions = [
  "Google",
  "Microsoft",
  "Amazon",
  "Facebook",
  "Apple",
  "Netflix",
  "Tesla",
  "Airbnb",
  "LinkedIn",
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function AddJob() {
  const [form, setForm] = useState({
    role: "",
    company: "",
    postedDate: new Date().toISOString().slice(0, 10),
    salary: "",
    experience: "",
    jobDescription: "",
  });

  const [loading, setLoading] = useState(false);
  const { addJob } = useJobStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await addJob(form, () => navigate("/dashboard"));
    setLoading(false);
  };

  return (
    <AuthLayout>
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="max-w-lg mx-auto bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-800"
      >
        <h2 className="text-3xl font-extrabold text-center mb-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Post a New Job
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Job Title
            </label>
            <input
              list="jobTitles"
              name="role"
              type="text"
              placeholder="Select or type job title"
              value={form.role}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
            <datalist id="jobTitles">
              {jobTitleOptions.map((title) => (
                <option key={title} value={title} />
              ))}
            </datalist>
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Company
            </label>
            <input
              list="companies"
              name="company"
              type="text"
              placeholder="Select or type company name"
              value={form.company}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
            <datalist id="companies">
              {companyOptions.map((company) => (
                <option key={company} value={company} />
              ))}
            </datalist>
          </div>

          {/* Posted Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Posted Date
            </label>
            <input
              name="postedDate"
              type="date"
              value={form.postedDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Salary */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Salary (in LPA)
            </label>
            <input
              name="salary"
              type="text"
              placeholder="e.g. 4–6 LPA"
              value={form.salary}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Experience */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Experience (in years)
            </label>
            <input
              name="experience"
              type="number"
              placeholder="e.g. 2"
              value={form.experience}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Job Description
            </label>
            <textarea
              name="jobDescription"
              placeholder="Write detailed job description..."
              value={form.jobDescription}
              onChange={handleChange}
              required
              rows="4"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"
            />
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-lg font-semibold text-white shadow-md transition ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-lg"
            }`}
          >
            {loading ? "Posting..." : "Post Job"}
          </motion.button>
        </form>
      </motion.div>
    </AuthLayout>
  );
}
