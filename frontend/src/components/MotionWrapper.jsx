import { motion } from "framer-motion";

export default function MotionWrapper({ children, duration = 0.35, yOffset = 20 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -yOffset }}
      transition={{ duration, ease: "easeInOut" }}
      className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black"
    >
      {children}
    </motion.div>
  );
}
