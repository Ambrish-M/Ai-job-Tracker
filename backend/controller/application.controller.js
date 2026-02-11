import PostedJob from "../models/postedJob.model.js"; 
import mongoose from "mongoose";
import axios from "axios";
import JobApplication from "../models/jobApplication.model.js";
import { ENV_VARS } from "../config/envVars.js";

/**
 * Apply for a job
 * Expects: jobId, name, phone, email, resume { fileUrl, publicId, originalName }
 */

export const applyJob = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(400).json({ message: "User not authenticated" });
    }

    const { jobId, name, email, phone, resume } = req.body;

    if (!jobId || !name || !email || !phone) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (name) {
      if (name.length < 2) {
        return res
          .status(400)
          .json({ message: "The name must be at least two characters long" });
      }
    }
    if (phone.length !== 10) {
      return res
        .status(400)
        .json({ message: "Mobile number should be 10 digits" });
    }

    // Resume validation
    if (!resume || !resume.url || !resume.publicId || !resume.originalName) {
      return res
        .status(400)
        .json({ message: "Resume upload information is missing" });
    }

    const job = await PostedJob.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });
    const existingApplication = await JobApplication.findOne({
      userId: req.user._id,
      jobId,
    });

    if (existingApplication) {
      return res
        .status(400)
        .json({ message: "You have already applied for this job" });
    }

    const application = await JobApplication.create({
      userId,
      jobId,
      name,
      email,
      phone,
      resume: {
        url: resume.url,
        publicId: resume.publicId,
        originalName: resume.originalName,
      },
      jobSnapshot: {
        role: job.role,
        company: job.company,
        salary: job.salary,
        experience: job.experience,
      },
    });

    res.status(201).json({
      message: "Job applied successfully",
      application,
    });
  } catch (error) {
    console.error("Apply Job Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get logged-in user's applications

export const getMyApplications = async (req, res) => {
  try {
    const applications = await JobApplication.find({ userId: req.user._id })
      .populate("jobId", "role company salary experience")
      .sort({ createdAt: -1 })
      .lean();

    res.json(applications);
  } catch (error) {
    console.error("Get My Applications Error:", error);
    res.status(500).json({ message: error.message });
  }
};

//Update application status




export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    //  Validate input
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid application ID" });
    }
    if (!status || typeof status !== "string") {
      return res.status(400).json({ message: "Invalid status" });
    }

    //  Find application
    const application = await JobApplication.findById(id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Update status in DB
    application.status = status;
    try {
      await application.save();
    } catch (dbError) {
      console.error("DB Save Error:", dbError);
      return res.status(500).json({
        message: "Failed to update status",
        error: dbError.message,
      });
    }

    //  Prepare email content
    const closingMessage =
      status === "Interview Scheduled"
        ? "<p>🎯 Congratulations! You've been selected for the interview.</p>"
        : status === "Rejected"
        ? "<p>❌ Unfortunately, this application was not successful.</p>"
        : status === "Offer"
        ? "<p>🎉 Congratulations on receiving the offer!</p>"
        : "<p>📌 Best of luck!</p>";

    const htmlContent = `
      <p>Hi ${application.name || "Applicant"},</p>
      <p>
        Your application for <b>${application.jobSnapshot?.role || "the role"}</b>
        at <b>${application.jobSnapshot?.company || "the company"}</b>
        is now <b>${status}</b>.
      </p>
      ${closingMessage}
      <br />
      <p>Regards,<br/>AI Job Tracker Team</p>
    `;

    // Ensure recipient exists
    if (!application.email) {
      console.error("Recipient email missing for application:", id);
      return res.status(400).json({
        message: "Recipient email is missing",
        application,
      });
    }

    // Send email using axios (direct API call)
    try {
      const response = await axios.post(
        "https://api.sendinblue.com/v3/smtp/email",
        {
          sender: { name: "AI Job Tracker", email: "ambrish2706@gmail.com" }, // verified sender
          to: [{ email: application.email, name: application.name || "Applicant" }],
          subject: `Application Status Update - ${application.jobSnapshot?.role || ""}`,
          htmlContent,
        },
        {
          headers: {
            "api-key": ENV_VARS.BREVO_SMTP_KEY,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      console.log("Email sent successfully:", response.data);

      return res.status(200).json({
        message: "Status updated and email sent successfully",
        application,
      });
    } catch (emailError) {
      console.error("Email Send Error:", emailError.response?.data || emailError.message);
      return res.status(200).json({
        message: "Status updated, but failed to send email",
        application,
        emailError: emailError.response?.data?.message || emailError.message,
      });
    }
  } catch (error) {
    console.error("Update Status Unexpected Error:", error);
    return res.status(500).json({
      message: "Unexpected error occurred",
      error: error.message,
    });
  }
};





// Admin: Get all applications

export const getApplications = async (req, res) => {
  try {
    const applications = await JobApplication.find()
      .populate("jobId", "role company salary experience")
      .sort({ createdAt: -1 })
      .lean();

    res.json(applications);
  } catch (error) {
    console.error("Get Applications Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Mark resume as viewed by admin
export const markResumeViewed = async (req, res) => {
  try {
    const { appId } = req.params;
    const application = await JobApplication.findById(appId);

    if (!application)
      return res.status(404).json({ message: "Application not found" });

    application.viewedByAdmin = true;
    await application.save();

    res.json({ message: "Resume marked as viewed", application });
  } catch (error) {
    console.error("Mark resume viewed error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
