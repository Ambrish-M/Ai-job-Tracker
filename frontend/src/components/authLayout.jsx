import { motion } from "framer-motion";

export default function AuthLayout({ children, title = "AI Job Tracker" }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-950 dark:to-black text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <motion.h1
        initial={{ opacity: 0, y: -20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-4xl md:text-5xl font-extrabold mb-10 tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
      >
        {title}
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-white/70 dark:bg-gray-900/70 backdrop-blur-md rounded-2xl shadow-xl p-6 md:p-8 border border-gray-200 dark:border-gray-800"
      >
        {children}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1.2 }}
        className="mt-8 text-sm text-gray-500 dark:text-gray-400"
      >
        © {new Date().getFullYear()} AI Job Tracker. All rights reserved.
      </motion.p>
    </div>
  );
}
