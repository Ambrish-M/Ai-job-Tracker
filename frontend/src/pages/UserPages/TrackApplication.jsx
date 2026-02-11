import { useEffect, useState } from "react";
import api from "../../utils/axiosInstance";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function TrackApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApps = async () => {
    try {
      const res = await api.get("/applications/my-applications");
      setApplications(res.data);
    } catch (err) {
      console.error("Failed to fetch applications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 dark:from-gray-900 dark:to-black dark:text-gray-100 transition-colors duration-500">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500">
            Track My Applications
          </h1>

          <button
            onClick={fetchApps}
            className="mt-4 sm:mt-0 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
          >
            Refresh
          </button>
        </div>

        {/* Empty State */}
        {applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-xl shadow-lg py-20 transition-all duration-300">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              You haven’t applied to any jobs yet.
            </p>
          </div>
        ) : (
          /* Applications Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {applications.map((app, index) => {
              const roleName =
                app.jobId?.role || app.jobSnapshot?.role || "Unknown Role";
              const companyName =
                app.jobId?.company ||
                app.jobSnapshot?.company ||
                "Unknown Company";

              return (
                <div
                  key={app._id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="p-6 flex flex-col justify-between h-full">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                          {roleName}
                        </h2>
                        <span className="text-xs text-gray-400">
                          #{index + 1}
                        </span>
                      </div>

                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        {companyName}
                      </p>

                      <div className="space-y-2 text-sm">
                        <p>
                          <span className="font-semibold">Status:</span>{" "}
                          <span
                            className={`px-2 py-1 rounded-md text-xs font-medium ${
                              app.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200"
                                : app.status === "Accepted"
                                ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200"
                                : app.status === "Rejected"
                                ? "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {app.status || "Unknown"}
                          </span>
                        </p>

                        <p>
                          <span className="font-semibold">Resume:</span>{" "}
                          {app.viewedByAdmin ? (
                            <span className="text-green-600 dark:text-green-400 font-medium">
                               Viewed by Admin
                            </span>
                          ) : (
                            <span className="text-yellow-600 dark:text-yellow-400 font-medium">
                               Not Viewed Yet
                            </span>
                          )}
                        </p>

                        <p className="text-gray-500 dark:text-gray-400 text-xs">
                          📅 Applied on{" "}
                          {new Date(app.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
