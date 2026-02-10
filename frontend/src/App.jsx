import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import useAuthStore from "./store/authStore";

// Components
import LoadingSpinner from "./components/LoadingSpinner";
import MotionWrapper from "./components/MotionWrapper.jsx";

// Pages

import Dashboard from "./pages/AdminPages/Dashboard";
import AddJob from "./pages/AdminPages/AddJob";
import UpdateJob from "./pages/AdminPages/UpdateJob";
import Analytics from "./pages/AdminPages/Analytics";
import ManageApplications from "./pages/AdminPages/ManageApplication.js";
import Home from "./pages/UserPages/Home";
import AiTools from "./pages/UserPages/AiTools";
import TrackApplications from "./pages/UserPages/TrackApplication";
import AppliedJobs from "./pages/UserPages/AppliedJob";
import Login from "./pages/AuthPages/Login.jsx";
import Register from "./pages/AuthPages/Register.jsx";
import Profile from "./pages/AuthPages/Profile.jsx";

export default function App() {
  const { checkAuth, user, initializing } = useAuthStore();

  const wrap = (C) => (
    <MotionWrapper duration={0.5} yOffset={40}>
      <C />
    </MotionWrapper>
  );

  useEffect(() => {
    checkAuth();
  }, []);

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <LoadingSpinner />
      </div>
    );
  }

  const role = user?.role;

  return (
    <div className="min-h-screen bg-gray-900 text-white transition-colors duration-300">
      <AnimatePresence mode="wait">
        <Routes>

          {/* Admin Routes */}
          {role === "admin" && (
            <>
              <Route path="/dashboard" element={wrap(Dashboard)} />
              <Route path="/add-job" element={wrap(AddJob)} />
              <Route path="/jobs/:id/edit" element={wrap(UpdateJob)} />
              <Route path="/analytics" element={wrap(Analytics)} />
              <Route path="/applications" element={wrap(ManageApplications)} />
              <Route path="/profile" element={wrap(Profile)} />
            </>
          )}

          {/* User Routes */}
          {role === "user" && (
            <>
              <Route path="/home" element={wrap(Home)} />
              <Route path="/ai-tools" element={wrap(AiTools)} />
              <Route path="/track-applications" element={wrap(TrackApplications)} />
              <Route path="/applied-jobs" element={wrap(AppliedJobs)} />
              <Route path="/profile" element={wrap(Profile)} />
            </>
          )}

          {/* Public Routes */}
          {!role && (
            <>
              <Route path="/login" element={wrap(Login)} />
              <Route path="/register" element={wrap(Register)} />
            </>
          )}

          {/* Fallback */}
          <Route
            path="*"
            element={
              role === "admin"
                ? <Navigate to="/dashboard" replace />
                : role === "user"
                  ? <Navigate to="/home" replace />
                  : <Navigate to="/login" replace />
            }
          />

        </Routes>
      </AnimatePresence>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2500,
          style: { background: "#333", color: "#fff" },
        }}
      />
    </div>
  );
}


