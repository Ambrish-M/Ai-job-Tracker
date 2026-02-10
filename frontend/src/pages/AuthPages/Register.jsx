import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiEye, FiEyeOff } from "react-icons/fi";
import useAuthStore from "../../store/authStore";
import AuthLayout from "../../components/authLayout";
import toast from "react-hot-toast";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    adminKey: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminKey, setShowAdminKey] = useState(false);

  const { register } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await register(form, navigate);
    } catch (err) {
      toast.error("Registration failed. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-semibold text-center mb-6 bg-gradient-to-r from-gray-500 to-red-600 bg-clip-text text-transparent"
      >
        Register
      </motion.h2>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-4"
      >
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">
            Name
          </label>
          <input
            name="name"
            type="text"
            required
            placeholder="Enter your name"
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-900 text-gray-100 placeholder-gray-500"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">
            Email
          </label>
          <input
            name="email"
            type="email"
            required
            placeholder="Enter your email"
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-900 text-gray-100 placeholder-gray-500"
          />
        </div>

        {/* Password with Eye */}
        <div className="relative">
          <label className="block text-sm font-medium mb-1 text-gray-300">
            Password
          </label>
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            required
            placeholder="Enter your password"
            onChange={handleChange}
            className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-700 bg-gray-900 text-gray-100 placeholder-gray-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-200"
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        </div>

        {/* Role Selection */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">
            Account Type
          </label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-900 text-gray-100"
          >
            <option value="user">Job Seeker</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Admin Key with Eye (Conditional) */}
        {form.role === "admin" && (
          <div className="relative">
            <label className="block text-sm font-medium mb-1 text-gray-300">
              Admin Access Key
            </label>
            <input
              name="adminKey"
              type={showAdminKey ? "text" : "password"}
              required
              placeholder="Enter admin access key"
              onChange={handleChange}
              className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-700 bg-gray-900 text-gray-100 placeholder-gray-500"
            />
            <button
              type="button"
              onClick={() => setShowAdminKey((prev) => !prev)}
              className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-200"
            >
              {showAdminKey ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
        )}

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: !isSubmitting ? 1.02 : 1 }}
          whileTap={{ scale: !isSubmitting ? 0.98 : 1 }}
          className="w-full py-2.5 rounded-lg bg-gradient-to-r from-gray-500 to-red-600 text-white font-medium shadow-md transition disabled:opacity-60"
        >
          {isSubmitting ? "Registering..." : "Register"}
        </motion.button>
      </motion.form>

      <p className="text-center mt-4 text-gray-300 text-sm">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-red-400 hover:text-red-300 transition font-medium"
        >
          Login
        </Link>
      </p>
    </AuthLayout>
  );
}
