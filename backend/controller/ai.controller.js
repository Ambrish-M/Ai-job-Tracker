import { GoogleGenerativeAI } from "@google/generative-ai";
import { ENV_VARS } from "../config/envVars.js";

const genAI = new GoogleGenerativeAI(ENV_VARS.GEMINI_API_KEY);

// GLOBAL ERROR HANDLER
const handleGeminiError = (error, res) => {
  console.error("Gemini API Error:", error);
  return res.status(500).json({
    message: "Error communicating with AI service",
    details: error?.message || "Unknown error",
  });
};

//  Generate Cover Letter

export const generateCoverLetter = async (req, res) => {
  try {
    const {
      role,
      company,
      resumeText = "",
      tone = "professional",
      extraPoints = "",
    } = req.body;

    if (!role || !company) {
      return res
        .status(400)
        .json({ message: "Please provide role and company" });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        response_mime_type: "application/json",
      },
    });

    const prompt = `
Write a ${tone} cover letter for the role "${role}" at "${company}", based on this resume:

${resumeText}

Also highlight these additional points: ${extraPoints}

Return a JSON with:
{
  "coverLetter": "...",
  "highlights": ["...", "..."]
}
    `;

    const result = await model.generateContent(prompt);

    const data = JSON.parse(result.response.text());

    return res.json({
      coverLetter: data.coverLetter,
      highlights: data.highlights || [],
    });
  } catch (error) {
    return handleGeminiError(error, res);
  }
};

// Resume Feedback

export const getResumeFeedback = async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({
        message: "Please provide resumeText and jobDescription",
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are a senior hiring manager.
Analyze this resume compared to the job description.

Resume:
${resumeText}

Job Description:
${jobDescription}

Give:
- Strengths
- Weaknesses
- Missing skills
- Actionable improvements
    `;

    const result = await model.generateContent(prompt);

    return res.json({ feedback: result.response.text() });
  } catch (error) {
    return handleGeminiError(error, res);
  }
};

//  Interview Questions

export const getInterviewQuestions = async (req, res) => {
  try {
    const { role, company } = req.body;

    if (!role) {
      return res.status(400).json({ message: "Please provide role" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
Generate 10 interview questions for the role of "${role}" at "${
      company || "the company"
    }".
Include:
- 5 technical questions
- 5 behavioral questions
Return as a numbered list.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const questions = text
      .split("\n")
      .map((q) => q.replace(/^\d+\.\s*/, "").trim())
      .filter(Boolean);

    return res.json({ questions });
  } catch (error) {
    return handleGeminiError(error, res);
  }
};
