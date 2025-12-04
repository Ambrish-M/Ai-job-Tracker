import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AuthLayout from "../../components/authLayout";
import useProfileStore from "../../store/useProfileStore";
import useAuthStore from "../../store/authStore";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { profile, fetchProfile, updateProfile, loading } = useProfileStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "" });

  useEffect(() => {
    fetchProfile(); 
  }, []);

  useEffect(() => {
    if (profile) {
      setForm({ name: profile.name, email: profile.email });
    }
  }, [profile]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProfile(form, navigate);
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-lg mx-auto bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-8 border border-gray-200 dark:border-gray-800">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">
            Profile
          </h2>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              navigate(user?.role === "user" ? "/home" : "/dashboard")
            }
            className="text-sm font-medium text-gray-100 bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition"
          >
            ← Back
          </motion.button>
        </div>

        {/* Loading */}
        {loading && !profile ? (
          <div className="flex justify-center py-10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"
            />
          </div>
        ) : (

          /* Form */
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-5"
          >
            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
                Name
              </label>
              <input
                name="name"
                type="text"
                value={form.name}
                required
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                required
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-md transition disabled:opacity-70"
            >
              {loading ? "Updating..." : "Update Profile"}
            </motion.button>
          </motion.form>
        )}
      </div>
    </AuthLayout>
  );
}
