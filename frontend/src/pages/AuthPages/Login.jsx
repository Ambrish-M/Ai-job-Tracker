import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useAuthStore from "../../store/authStore";
import AuthLayout from "../../components/authLayout";
import toast from "react-hot-toast";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await login(form, navigate);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-semibold text-center mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent"
      >
        Login
      </motion.h2>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-5"
      >
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Email Address
          </label>
          <input
            name="email"
            type="email"
            placeholder="Enter your email"
            value={form.email}
            autoFocus
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Password
          </label>
          <input
            name="password"
            type="password"
            minLength={6}
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700"
          />
        </div>

        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: !isSubmitting ? 1.02 : 1 }}
          className="w-full py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-md flex justify-center items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </motion.button>
      </motion.form>

      <p className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
        Don’t have an account?{" "}
        <Link to="/register" className="font-medium text-indigo-500">
          Register
        </Link>
      </p>
    </AuthLayout>
  );
}
