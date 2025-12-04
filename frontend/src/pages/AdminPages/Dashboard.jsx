import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import useJobStore from "../../store/useJobStore";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" },
  }),
};

export default function Dashboard() {
  const { user, checkAuth, logout } = useAuthStore();
  const { jobs, fetchJobs, deleteJob } = useJobStore();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    fetchJobs();
  }, []);

  if (!user || user.role !== "admin") return null;

  const cards = [
    {
      title: "Add New Job",
      desc: "Post a new job opening for candidates.",
      color: "from-indigo-500 to-purple-600",
      btn: "Add Job",
      onClick: () => navigate("/add-job"),
    },
    {
      title: "Manage Applications",
      desc: "View and update the status of applications.",
      color: "from-emerald-500 to-teal-600",
      btn: "Manage",
      onClick: () => navigate("/applications"),
    },
    {
      title: "Analytics",
      desc: "View insights and job posting statistics.",
      color: "from-orange-400 to-pink-500",
      btn: "View",
      onClick: () => navigate("/analytics"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black text-gray-800 dark:text-gray-100">
      {/* Navbar */}
      <header className="flex items-center justify-between px-6 py-4 bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg shadow-md sticky top-0 z-50">
        <h1 className="text-xl font-bold tracking-wide">
          Job Tracker <span className="text-indigo-500">(Admin)</span>
        </h1>
        <div className="flex items-center gap-3">
          <Link
            to="/profile"
            className="px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            Profile
          </Link>
          <button
            onClick={() => logout(navigate)}
            className="px-3 py-2 text-sm font-medium rounded-lg bg-red-500 hover:bg-red-600 text-white transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Welcome */}
      <div className="p-6 max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-3xl font-semibold mb-8"
        >
          Welcome, <span className="text-indigo-500">{user?.name}</span> 👋
        </motion.h2>

        {/* Feature Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {cards.map((card, i) => (
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
        </section>

        {/* Job Listings */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">All Posted Jobs</h2>

          {jobs.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No jobs posted yet
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job, index) => (
                <motion.div
                  key={job._id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  custom={index}
                  className="p-6 rounded-2xl bg-white dark:bg-gray-900 shadow-md border border-gray-100 dark:border-gray-800 transition hover:shadow-xl"
                >
                  <h3 className="text-lg font-semibold">{job.role}</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {job.company}
                  </p>
                  <p className="text-sm mt-2">
                    💰 <span className="font-medium">Salary:</span>{" "}
                    {job.salary || "Not specified"}
                  </p>
                  <p className="text-sm">
                    📅 <span className="font-medium">Experience:</span>{" "}
                    {job.experience || "Not specified"} years
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    📌 Posted on:{" "}
                    {job.postedDate
                      ? new Date(job.postedDate).toLocaleDateString()
                      : "N/A"}
                  </p>

                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                    {job.jobDescription || "No description provided"}
                  </p>

                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      onClick={() => navigate(`/jobs/${job._id}/edit`)}
                      className="px-3 py-1.5 text-sm rounded-lg bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteJob(job._id)}
                      className="px-3 py-1.5 text-sm rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
