import PostedJob from "../models/postedJob.model.js";
import JobApplication from "../models/jobApplication.model.js";
import fetch from "node-fetch";
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

    // Find application
    const application = await JobApplication.findById(id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Update status
    application.status = status;
    await application.save();

    // Dynamic closing message
    const closingMessage =
      status === "Interview Scheduled"
        ? "<p>🎯 Congratulations! You've been selected for the interview.</p>"
        : status === "Rejected"
          ? "<p>❌ Unfortunately, this application was not successful.</p>"
          : status === "Offer"
            ? "<p>🎉 Congratulations on receiving the offer!</p>"
            : "<p>📌 Best of luck!</p>";

    const htmlContent = `
      <p>Hi ${application.name},</p>
      <p>
        Your application for <b>${application.jobSnapshot?.role}</b>
        at <b>${application.jobSnapshot?.company}</b>
        is now <b>${status}</b>.
      </p>
      ${closingMessage}
      <br />
      <p>Regards,<br/>AI Job Tracker Team</p>
    `;

    // Validate ENV_VARS
    if (!ENV_VARS.EMAIL_USER || !/@/.test(ENV_VARS.EMAIL_USER)) {
      return res.status(500).json({ message: `Invalid EMAIL_USER: ${ENV_VARS.EMAIL_USER}` });
    }
    if (!ENV_VARS.BREVO_SMTP_KEY) {
      return res.status(500).json({ message: "Missing Brevo SMTP/API key" });
    }

    // Send email via Brevo API
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": ENV_VARS.BREVO_SMTP_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: "AI Job Tracker", email: ENV_VARS.EMAIL_USER },
        to: [{ email: application.email }],
        subject: `Application Status Update - ${application.jobSnapshot?.role}`,
        htmlContent,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Brevo API Error:", err);
      return res.status(500).json({ message: "Failed to send email", error: err });
    }

    const result = await response.json();
    console.log("Email sent via Brevo API:", result.messageId || result);

    res.status(200).json({
      message: "Status updated and email sent successfully via Brevo API",
      application,
    });

  } catch (error) {
    console.error("Update Status Error:", error);
    res.status(500).json({ message: "Failed to update status", error: error.message });
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
