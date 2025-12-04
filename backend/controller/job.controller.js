import PostedJob from "../models/postedJob.model.js";

// Admin: Create Job
export const createJob = async (req, res) => {
  try {
    const { company, role, salary, experience, jobDescription, postedDate } =
      req.body;

    if (!company || !role || !salary) {
      return res
        .status(400)
        .json({ message: "Company, role, and salary are required" });
    }

    const job = new PostedJob({
      company,
      role,
      salary,
      experience,
      jobDescription,
      postedDate: postedDate ? new Date(postedDate) : undefined,
      createdBy: req.user._id,
    });

    await job.save();
    res.status(201).json({ message: "Job created successfully", job });
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({ message: error.message });
  }
};

// Admin: Get All Jobs
export const getJobs = async (req, res) => {
  try {
    const jobs = await PostedJob.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Admin: Update Job
export const updateJob = async (req, res) => {
  try {
    if (req.body.postedDate) {
      req.body.postedDate = new Date(req.body.postedDate); //  ensure proper Date
    }

    const updated = await PostedJob.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updated) return res.status(404).json({ message: "Job not found" });
    res.json({ message: "Job updated successfully", job: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Delete Job
export const deleteJob = async (req, res) => {
  try {
    const deleted = await PostedJob.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Job not found" });

    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
