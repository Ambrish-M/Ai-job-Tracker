import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useJobStore from "../../store/useJobStore";
import toast from "react-hot-toast";
import AuthLayout from "../../components/authLayout";

export default function UpdateJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { jobs, fetchJobs, updateJob, loading } = useJobStore();

  const [form, setForm] = useState({
    role: "",
    company: "",
    postedDate: "",
    salary: "",
    experience: "",
    jobDescription: "",
  });
  const [prefilling, setPrefilling] = useState(true);

  useEffect(() => {
    const loadJobData = async () => {
      try {
        if (jobs.length === 0) await fetchJobs();
        const jobToEdit = jobs.find((job) => job._id === id);
        if (!jobToEdit) {
          toast.error("Job not found");
          navigate("/dashboard");
          return;
        }
        setForm({
          role: jobToEdit.role || "",
          company: jobToEdit.company || "",
          postedDate: jobToEdit.postedDate
            ? new Date(jobToEdit.postedDate).toISOString().slice(0, 10)
            : "",
          salary: jobToEdit.salary || "",
          experience: jobToEdit.experience || "",
          jobDescription: jobToEdit.jobDescription || "",
        });
      } catch (err) {
        console.error("Failed to load job data", err);
        toast.error("Failed to load job details");
      } finally {
        setPrefilling(false);
      }
    };
    loadJobData();
  }, [id, jobs, fetchJobs, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateJob(id, form);
      navigate("/dashboard");
    } catch (err) {
      console.error("Update failed", err);
      toast.error("Failed to update job");
    }
  };

  if (prefilling) {
    return (
      <AuthLayout>
        <div className="flex justify-center items-center min-h-[300px]">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4 py-12">
        <div className="w-full max-w-xl bg-gray-900/60 backdrop-blur-md border border-gray-700 rounded-2xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-center text-white mb-8">
            ✏️ Update Job
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {[
              { label: "Role", name: "role", type: "text" },
              { label: "Company", name: "company", type: "text" },
              { label: "Posted Date", name: "postedDate", type: "date" },
              { label: "Salary (in LPA)", name: "salary", type: "text" },
              {
                label: "Experience (in years)",
                name: "experience",
                type: "text",
              },
            ].map(({ label, name, type }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  {label}
                </label>
                <input
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  required={name !== "salary" && name !== "experience"}
                  className="w-full input input-bordered bg-gray-800 border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            ))}

            {/* Job Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Job Description
              </label>
              <textarea
                name="jobDescription"
                value={form.jobDescription}
                onChange={handleChange}
                rows="4"
                required
                className="w-full textarea textarea-bordered bg-gray-800 border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                loading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30"
              }`}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Job"}
            </button>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
}
