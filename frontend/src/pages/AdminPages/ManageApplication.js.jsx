import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../utils/axiosInstance";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function ManageApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchApplications = async () => {
    try {
      const res = await api.get("/applications/getapplications");
      setApplications(res?.data || []);
    } catch (err) {
      console.error("Failed to fetch applications", err);
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleStatusChange = async (appId, newStatus) => {
    if (!appId) return;
    try {
      setUpdatingId(appId);
      await api.put(`/applications/${appId}/status`, { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
      fetchApplications();
      window.dispatchEvent(new Event("analyticsRefresh"));
    } catch (err) {
      console.error("Status update failed", err);
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const viewResume = async (appId, resume) => {
    if (!resume?.url) {
      toast.error("Resume not found");
      return;
    }

    try {
      await api.put(`/applications/${appId}/viewed`);
      window.open(resume.url, "_blank", "noopener,noreferrer");
    } catch (err) {
      console.error("Error opening resume", err);
      toast.error("Failed to open resume");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black text-gray-800 dark:text-gray-100 px-4 sm:px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-3xl font-semibold mb-8"
        >
          Manage Applications
        </motion.h1>

        {applications.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-500 dark:text-gray-400"
          >
            No applications received yet.
          </motion.p>
        ) : (
          <>
            {/* ================= DESKTOP TABLE ================= */}
            <div className="hidden md:block overflow-hidden rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                  <tr>
                    <th className="px-6 py-3">Job</th>
                    <th className="px-6 py-3">Candidate</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Phone</th>
                    <th className="px-6 py-3">Resume</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app, i) => {
                    const roleName =
                      app.jobId?.role ||
                      app.jobSnapshot?.role ||
                      "Unknown Role";
                    const companyName =
                      app.jobId?.company ||
                      app.jobSnapshot?.company ||
                      "Unknown Company";

                    return (
                      <motion.tr
                        key={app._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="border-t border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <td className="px-6 py-4">
                          <p className="font-medium">{roleName}</p>
                          <p className="text-xs text-gray-500">
                            {companyName}
                          </p>
                        </td>
                        <td className="px-6 py-4">{app.name}</td>
                        <td className="px-6 py-4">{app.email}</td>
                        <td className="px-6 py-4">
                          {app.phone || "—"}
                        </td>
                        <td className="px-6 py-4">
                          {app.resume ? (
                            <button
                              onClick={() =>
                                viewResume(app._id, app.resume)
                              }
                              className="px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                            >
                              View Resume
                            </button>
                          ) : (
                            <span className="text-gray-500 text-xs">
                              Not uploaded
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={app.status || "Pending"}
                            onChange={(e) =>
                              handleStatusChange(
                                app._id,
                                e.target.value
                              )
                            }
                            disabled={updatingId === app._id}
                            className="px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Interview Scheduled">
                              Interview Scheduled
                            </option>
                            <option value="Offer">Offer</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* ================= MOBILE CARDS ================= */}
            <div className="md:hidden space-y-4">
              {applications.map((app) => {
                const roleName =
                  app.jobId?.role ||
                  app.jobSnapshot?.role ||
                  "Unknown Role";
                const companyName =
                  app.jobId?.company ||
                  app.jobSnapshot?.company ||
                  "Unknown Company";

                return (
                  <div
                    key={app._id}
                    className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-4 border border-gray-200 dark:border-gray-800"
                  >
                    <div className="mb-2">
                      <p className="font-semibold">{roleName}</p>
                      <p className="text-xs text-gray-500">
                        {companyName}
                      </p>
                    </div>

                    <p className="text-sm">
                      <span className="font-medium">Name:</span>{" "}
                      {app.name}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Email:</span>{" "}
                      {app.email}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Phone:</span>{" "}
                      {app.phone || "—"}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 mt-4">
                      {app.resume && (
                        <button
                          onClick={() =>
                            viewResume(app._id, app.resume)
                          }
                          className="px-3 py-1 text-xs bg-indigo-600 text-white rounded-md"
                        >
                          Resume
                        </button>
                      )}

                      <select
                        value={app.status || "Pending"}
                        onChange={(e) =>
                          handleStatusChange(
                            app._id,
                            e.target.value
                          )
                        }
                        disabled={updatingId === app._id}
                        className="px-2 py-1 text-xs border rounded-md bg-white dark:bg-gray-800"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Interview Scheduled">
                          Interview Scheduled
                        </option>
                        <option value="Offer">Offer</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
