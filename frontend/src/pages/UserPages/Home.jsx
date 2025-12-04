import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import useJobStore from "../../store/useJobStore";
import useUploadStore from "../../store/uploadStore";
import api from "../../utils/axiosInstance";
import toast from "react-hot-toast";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.4 },
  }),
};

export default function Home() {
  const navigate = useNavigate();

  const { user, checkAuth, logout } = useAuthStore();
  const { jobs, fetchJobs } = useJobStore();
  const {
    resume,
    uploadFile,
    deleteFile,
    loading: uploadLoading,
  } = useUploadStore();

  const [selectedJob, setSelectedJob] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [applyLoading, setApplyLoading] = useState(false);

  // AUTH CHECK
  useEffect(() => {
    checkAuth();
  }, []);

  // FETCH JOBS
  useEffect(() => {
    if (user) fetchJobs();
  }, [user]);

  if (!user) return null;

  // Form change handler
  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Resume Upload
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (file && file.size > 2 * 1024 * 1024) {
      toast.error("File too large. Max size is 2MB.");
      return;
    }
    if (!file) return;

    try {
      const uploaded = await uploadFile(file);
      if (uploaded) toast.success("Resume uploaded!");
    } catch {
      toast.error("Upload failed");
    }
  };

  // Apply for job (FIXED)
  const handleApply = async (e) => {
    e.preventDefault();

    if (!selectedJob) return toast.error("No job selected");
    if (!resume?.url) return toast.error("Please upload your resume");

    if (!form.name.trim()) return toast.error("Name is required");
    if (!form.email.trim()) return toast.error("Email is required");
    if (!form.phone.trim()) return toast.error("Phone number is required");

    const payload = {
      jobId: selectedJob._id,
      name: form.name,
      email: form.email,
      phone: form.phone,
      resume: {
        url: resume.url,
        publicId: resume.publicId,
        originalName: resume.originalName,
      },
    };

    try {
      setApplyLoading(true);

      await api.post("/applications/apply", payload);

      toast.success("Application submitted!");

      // Reset
      setForm({ name: "", email: "", phone: "" });
      setSelectedJob(null);
    } catch (err) {
      console.error("Apply Job Error:", err);
      toast.error(err.response?.data?.message || "Failed to apply");
    } finally {
      setApplyLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black text-gray-100">
      {/* Navbar */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-950/70 backdrop-blur-sm sticky top-0 z-20">
        <h1 className="text-xl font-semibold">Job Tracker</h1>

        <div className="flex gap-4">
          <Link
            to="/profile"
            className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
          >
            Profile
          </Link>

          <button
            onClick={() => logout(navigate)}
            className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="px-6 py-10 max-w-7xl mx-auto">
        {/* Welcome */}
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold mb-8"
        >
          Welcome, <span className="text-blue-400">{user?.name}</span> 👋
        </motion.h2>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            {
              title: "Applied Jobs",
              desc: "See all the jobs you've applied to.",
              color: "from-blue-500 to-blue-700",
              onClick: () => navigate("/applied-jobs"),
              btn: "View",
            },
            {
              title: "AI Tools",
              desc: "Resume feedback & cover letter generator.",
              color: "from-purple-500 to-purple-700",
              onClick: () => navigate("/ai-tools"),
              btn: "Try",
            },
            {
              title: "Track Applications",
              desc: "Track your application status.",
              color: "from-emerald-500 to-emerald-700",
              onClick: () => navigate("/track-applications"),
              btn: "Track",
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              custom={i}
              whileHover={{
                scale: 1.05,
                y: -5,
                boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
              }}
              whileTap={{ scale: 0.97 }}
              onClick={card.onClick}
              className={`cursor-pointer p-6 rounded-2xl text-white bg-gradient-to-r ${card.color} transition-all`}
            >
              <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
              <p className="text-sm opacity-90 mb-4">{card.desc}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-auto inline-block px-4 py-2 bg-white/20 rounded-lg text-white font-medium text-sm backdrop-blur-md hover:bg-white/30 transition"
              >
                {card.btn}
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Jobs List */}
        <h2 className="text-2xl font-semibold mb-6">Available Jobs</h2>

        {!jobs?.length ? (
          <p className="text-gray-400">No jobs available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job, i) => (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 bg-gray-900 rounded-2xl shadow-md hover:shadow-lg transition"
              >
                <h3 className="text-lg font-semibold text-white">{job.role}</h3>
                <p className="text-gray-400">{job.company}</p>

                <p className="text-gray-300 text-sm mt-2">
                  💰 {job.salary || "Not specified"}
                </p>
                <p className="text-gray-300 text-sm">
                  📅 {job.experience || "Not specified"}
                </p>

                <p className="text-gray-400 text-sm mt-3 line-clamp-3">
                  {job.jobDescription}
                </p>

                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm"
                  >
                    Apply
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Apply Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-2xl"
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              Apply for {selectedJob.role} @ {selectedJob.company}
            </h2>

            <form onSubmit={handleApply} className="space-y-6">
              {/* Name, Email, Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  className="p-3 bg-gray-800 text-white rounded-lg"
                  value={form.name}
                  onChange={handleChange}
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="p-3 bg-gray-800 text-white rounded-lg"
                  value={form.email}
                  onChange={handleChange}
                />

                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  className="p-3 bg-gray-800 text-white rounded-lg md:col-span-2"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>

              {/* Resume Upload */}
              <div>
                <h3 className="text-white font-semibold mb-3">Resume</h3>

                {resume ? (
                  <div className="p-4 border rounded-xl bg-gray-800 flex justify-between items-center">
                    <div>
                      <p className="text-gray-200">{resume.originalName}</p>
                      <p className="text-gray-400 text-xs">Uploaded</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteFile(resume.publicId)}
                      className="text-red-400 hover:text-red-500"
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  <label className="inline-block cursor-pointer">
                    <span className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white text-sm">
                      {uploadLoading ? "Uploading..." : "Upload Resume"}
                    </span>
                    <input
                      type="file"
                      hidden
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeUpload}
                    />
                  </label>
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedJob(null)}
                  className="px-4 py-2 bg-gray-800 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={applyLoading || !resume}
                  className={`px-5 py-2 bg-blue-600 rounded-lg text-white ${
                    applyLoading || !resume
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {applyLoading ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
