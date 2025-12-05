import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import api from "../../utils/axiosInstance";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,

} from "recharts";
import { motion } from "framer-motion";

const COLORS = ["#3b82f6", "#facc15", "#22c55e", "#ef4444"];

export default function Analytics() {
  const navigate = useNavigate();
  const { user, checkAuth, loading } = useAuthStore();

  const [applications, setApplications] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const appsRes = await api.get("/applications/getapplications");
      setApplications(appsRes.data);
    } catch (err) {
      console.error("Error fetching analytics data:", err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await checkAuth();

      const currentUser = useAuthStore.getState().user;
      if (!currentUser || currentUser.role !== "admin") {
        navigate("/login", { replace: true });
        return;
      }

      fetchAnalytics();
    };

    init();

    const handleAppUpdate = (e) => {
      const updatedApp = e.detail;
      setApplications((prev) =>
        prev.map((a) => (a._id === updatedApp._id ? updatedApp : a))
      );
    };

    window.addEventListener("applicationUpdated", handleAppUpdate);
    return () =>
      window.removeEventListener("applicationUpdated", handleAppUpdate);
  }, [checkAuth, navigate]);

  if (loading || isFetching) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-950">
        <span className="loading loading-spinner loading-lg text-indigo-400"></span>
      </div>
    );
  }


  if (!user || user.role !== "admin") {
    navigate("/login", { replace: true });
    return null;
  }

  // ====== Derived Analytics Data ======
  const appsByStatus = [
    {
      name: "Applied",
      value: applications.filter((a) => a.status === "Applied").length,
    },
    {
      name: "Interview Scheduled",
      value: applications.filter((a) => a.status === "Interview Scheduled")
        .length,
    },
    {
      name: "Offer",
      value: applications.filter((a) => a.status === "Offer").length,
    },
    {
      name: "Rejected",
      value: applications.filter((a) => a.status === "Rejected").length,
    },
  ];

  // Jobs by Company (Using jobSnapshot inside applications)
  const jobsByCompany = Object.entries(
    applications.reduce((acc, app) => {
      const company = app.jobSnapshot?.company || "Unknown";
      acc[company] = (acc[company] || 0) + 1;
      return acc;
    }, {})
  ).map(([company, count]) => ({
    name: company,
    jobs: count,
  }));

  const appliedJobsByUser = Object.entries(
    applications.reduce((acc, app) => {
      const name = app.name || "Unknown";
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, count]) => ({ name, applications: count }));


  // ====== UI ======
  return (


    <motion.div
      className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-gray-100 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-3xl font-semibold mb-8"
      >
        Job Analytics Dashboard
      </motion.h1>
      {applications.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-500 dark:text-gray-400"
        >
          No applications status received yet.
        </motion.p>
      ) :


        (
          <>
            <div className="grid gap-8 md:grid-cols-2">

              <div className="p-6 bg-gray-900/80 border border-gray-700 rounded-2xl shadow-lg hover:shadow-indigo-500/20 transition">
                <h2 className="text-2xl font-semibold mb-4 text-indigo-400">
                  Applications by Status
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={appsByStatus}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {appsByStatus.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#9ca3af",
                        borderRadius: "8px",
                        border: "none",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>


              <div className="p-6 bg-gray-900/80 border border-gray-700 rounded-2xl shadow-lg hover:shadow-indigo-500/20 transition">
                <h2 className="text-2xl font-semibold mb-4 text-indigo-400">
                  Users applied Jobs by Company
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={jobsByCompany}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis allowDecimals={false} stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        borderRadius: "8px",
                        border: "none",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="jobs" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="p-6 bg-gray-900/80 border border-gray-700 rounded-2xl shadow-lg hover:shadow-indigo-500/20 transition mt-8">
              <h2 className="text-2xl font-semibold mb-4 text-indigo-400">
                Applications by User
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={appliedJobsByUser}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis allowDecimals={false} stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      borderRadius: "8px",
                      border: "none",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="applications" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>)};
    </motion.div>
  );
}
