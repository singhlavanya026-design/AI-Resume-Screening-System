import { Type } from "@google/genai";

export interface ResumeAnalysis {
  skills: {
    technical: string[];
    soft: string[];
  };
  experience: {
    title: string;
    company: string;
    duration: string;
    highlights: string[];
  }[];
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
  evaluation: {
    score: number;
    matchPercentage: number;
    experienceLevel: string;
    strengths: string[];
    weaknesses: string[];
  };
  suggestions: string[];
  optimization: {
    keywords: string[];
    recommendedSkills: string[];
    formattingTips: string[];
  };
  careerInsights: {
    trendingTech: string[];
    salaryRange: string;
    growthPotential: string;
  };
}

export const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    skills: {
      type: Type.OBJECT,
      properties: {
        technical: { type: Type.ARRAY, items: { type: Type.STRING } },
        soft: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["technical", "soft"],
    },
    experience: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          company: { type: Type.STRING },
          duration: { type: Type.STRING },
          highlights: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["title", "company", "duration", "highlights"],
      },
    },
    education: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          degree: { type: Type.STRING },
          institution: { type: Type.STRING },
          year: { type: Type.STRING },
        },
        required: ["degree", "institution", "year"],
      },
    },
    evaluation: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER },
        matchPercentage: { type: Type.NUMBER },
        experienceLevel: { type: Type.STRING },
        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["score", "matchPercentage", "experienceLevel", "strengths", "weaknesses"],
    },
    suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
    optimization: {
      type: Type.OBJECT,
      properties: {
        keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
        recommendedSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
        formattingTips: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["keywords", "recommendedSkills", "formattingTips"],
    },
    careerInsights: {
      type: Type.OBJECT,
      properties: {
        trendingTech: { type: Type.ARRAY, items: { type: Type.STRING } },
        salaryRange: { type: Type.STRING },
        growthPotential: { type: Type.STRING },
      },
      required: ["trendingTech", "salaryRange", "growthPotential"],
    },
  },
  required: ["skills", "experience", "education", "evaluation", "suggestions", "optimization", "careerInsights"],
};
