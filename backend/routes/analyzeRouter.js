const express = require("express");
require("dotenv").config();
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const Report = require("../model/report");

const {
  GoogleGenAI,
  createPartFromCodeExecutionResult,
} = require("@google/genai");
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

async function main(contents) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-001",
    contents: `
            Analyze the following content for misinformation and credibility. Do not give a simple "true" or "false" verdict.
            Instead, provide a detailed credibility report in JSON format. The JSON object must have these exact keys:
            - "credibilityScore": An integer score from 0 (highly unreliable) to 100 (highly credible).
            - "summary": A brief, neutral summary of the main claims in the content.
            - "manipulativeTechniques": An array of strings, each describing a detected manipulative technique (e.g., "Emotional Language", "Appeal to Authority", "False Dichotomy"). If none, return an empty array.
            - "sourceAnalysis": An analysis of the likely source, its potential biases, and overall reliability.
            - "factCheck": An array of objects, where each object has two keys: "claim" (the specific claim made in the text) and "verification" (a brief verification, correction, or context for that claim).

            Here is the content to analyze:
            ---
            ${contents}
            ---
        `,
  });
  return response.text;
}

// Analyze text content (requires authentication)
router.post("/text", authenticateToken, async (req, res) => {
  try {
    let contents = req.body.question;

    if (!contents) {
      return res.status(400).json({ error: "Content to analyze is required" });
    }

    let result = await main(contents);

    // Parse the result to ensure it's valid JSON
    let credibilityReport;
    try {
      credibilityReport = JSON.parse(result);
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      return res.status(500).json({ error: "Failed to analyze content" });
    }

    // Save the report to database
    const report = new Report({
      userId: req.user.uid,
      originalContent: contents,
      credibilityReport: credibilityReport,
    });

    await report.save();

    res.json({
      message: "Analysis completed successfully",
      report: credibilityReport,
      reportId: report._id,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Analysis failed" });
  }
});

// Get user's analysis history
router.get("/history", authenticateToken, async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.user.uid })
      .sort({ createdAt: -1 })
      .limit(50); // Limit to last 50 reports

    res.json({
      reports: reports.map((report) => ({
        id: report._id,
        originalContent: report.originalContent,
        credibilityScore: report.credibilityReport.credibilityScore,
        summary: report.credibilityReport.summary,
        createdAt: report.createdAt,
      })),
    });
  } catch (error) {
    console.error("History fetch error:", error);
    res.status(500).json({ error: "Failed to fetch analysis history" });
  }
});

// Get a specific report by ID
router.get("/report/:id", authenticateToken, async (req, res) => {
  try {
    const report = await Report.findOne({
      _id: req.params.id,
      userId: req.user.uid,
    });

    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    res.json({ report });
  } catch (error) {
    console.error("Report fetch error:", error);
    res.status(500).json({ error: "Failed to fetch report" });
  }
});

// Delete a report
router.delete("/report/:id", authenticateToken, async (req, res) => {
  try {
    const report = await Report.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.uid,
    });

    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    res.json({ message: "Report deleted successfully" });
  } catch (error) {
    console.error("Report deletion error:", error);
    res.status(500).json({ error: "Failed to delete report" });
  }
});

module.exports = router;
