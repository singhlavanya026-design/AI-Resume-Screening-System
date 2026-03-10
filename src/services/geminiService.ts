import { GoogleGenAI } from "@google/genai";
import { ResumeAnalysis, ANALYSIS_SCHEMA } from "../types";

export async function analyzeResume(resumeText: string, jobRole: string): Promise<ResumeAnalysis> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const genAI = new GoogleGenAI({ apiKey });
  
  const prompt = `
    Analyze the following resume text for the job role: "${jobRole}".
    Extract skills, experience, and education.
    Evaluate the resume against the job role and provide a score (0-100), match percentage, strengths, and weaknesses.
    Provide improvement suggestions, optimization keywords, and career insights.
    
    Resume Text:
    ${resumeText}
  `;

  const response = await genAI.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: ANALYSIS_SCHEMA as any,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("No response from AI");
  }

  return JSON.parse(text) as ResumeAnalysis;
}
