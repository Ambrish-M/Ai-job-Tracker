import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../utils/axiosInstance";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function AppliedJobs() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get("/applications/my-applications");
        setApplications(res?.data || []);
      } catch (err) {
        console.error("Failed to fetch applied jobs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const viewResume = (resume) => {
    if (!resume?.url) return;
    window.open(resume.url, "_blank", "noopener,noreferrer");
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black text-gray-100 px-6 py-10">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-center mb-10"
      >
        My Applied Jobs
      </motion.h1>

      {applications.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 bg-gray-900/60 border border-gray-800 rounded-2xl shadow-inner max-w-4xl mx-auto"
        >
          <p className="text-gray-400 text-lg">
            You haven’t applied to any jobs yet.
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {applications.map((app, i) => {
            const roleName =
              app.jobId?.role || app.jobSnapshot?.role || "Unknown Role";
            const companyName =
              app.jobId?.company ||
              app.jobSnapshot?.company ||
              "Unknown Company";
            const salary =
              app.jobId?.salary || app.jobSnapshot?.salary || "Not specified";
            const experience =
              app.jobId?.experience ||
              app.jobSnapshot?.experience ||
              "Not specified";

            return (
              <motion.div
                key={app._id}
                className="p-6 bg-gray-900 border border-gray-800 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-blue-400 mb-1">
                      {roleName}
                    </h2>
                    <p className="text-gray-400 mb-3">{companyName}</p>

                    <ul className="text-sm space-y-1 text-gray-300">
                      <li>💰 {salary}</li>
                      <li>📅 {experience}</li>
                    </ul>

                    <p className="text-xs text-gray-500 mt-3">
                      Applied on{" "}
                      {new Date(app.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="flex gap-2 mt-5">
                    {app.resume ? (
                      <button
                        onClick={() => viewResume(app.resume)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm"
                      >
                        View Resume
                      </button>
                    ) : (
                      <span className="text-gray-400 text-sm">
                        Not uploaded
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
