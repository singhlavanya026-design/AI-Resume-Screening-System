import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Search, 
  BarChart3, 
  Lightbulb, 
  TrendingUp, 
  CheckCircle2, 
  X,
  ArrowRight,
  ChevronRight,
  LayoutDashboard,
  BrainCircuit,
  Target,
  Rocket
} from 'lucide-react';
import { Button } from './components/Button';
import { Card } from './components/Card';
import { FileUpload } from './components/FileUpload';
import { analyzeResume } from './services/geminiService';
import { ResumeAnalysis } from './types';
import { cn } from './lib/utils';

type Step = 'landing' | 'upload' | 'analysis';
type AnalysisTab = 'skills' | 'evaluation' | 'suggestions' | 'optimization' | 'career' | 'report';

const JOB_ROLES = [
  "Software Developer",
  "Data Analyst",
  "AI Engineer",
  "Marketing Specialist",
  "Business Analyst",
  "Product Manager",
  "UX Designer",
  "Sales Representative"
];

export default function App() {
  const [step, setStep] = useState<Step>('landing');
  const [resumeText, setResumeText] = useState('');
  const [jobRole, setJobRole] = useState(JOB_ROLES[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState<AnalysisTab>('skills');

  const handleStartAnalysis = async () => {
    if (!resumeText.trim()) {
      alert("Please provide resume text or upload a file.");
      return;
    }
    setIsAnalyzing(true);
    try {
      const result = await analyzeResume(resumeText, jobRole);
      setAnalysis(result);
      setStep('analysis');
    } catch (error) {
      console.error(error);
      alert("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderLanding = () => (
    <div className="flex flex-col items-center text-center max-w-4xl mx-auto py-20 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-zinc-600 text-xs font-semibold mb-6">
          <BrainCircuit size={14} />
          POWERED BY GEMINI AI
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 mb-6">
          AI Resume <span className="text-zinc-500">Screening System</span>
        </h1>
        <p className="text-xl text-zinc-600 mb-10 max-w-2xl mx-auto">
          Analyze your resume with AI and discover how suitable it is for your dream job. Get instant feedback, score, and career insights.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" onClick={() => setStep('upload')} className="gap-2">
            Upload Resume <ArrowRight size={18} />
          </Button>
          <Button size="lg" variant="outline" onClick={() => setStep('upload')}>
            Try Resume Analysis
          </Button>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 w-full"
      >
        {[
          { icon: <Search className="text-blue-500" />, title: "Smart Extraction", desc: "Automatically detects skills, experience, and education." },
          { icon: <BarChart3 className="text-emerald-500" />, title: "Suitability Score", desc: "Get a 0-100 score based on your target job role." },
          { icon: <Lightbulb className="text-amber-500" />, title: "AI Suggestions", desc: "Personalized tips to make your resume stand out." }
        ].map((feature, i) => (
          <Card key={i} className="flex flex-col items-center text-center p-8">
            <div className="mb-4 p-3 rounded-xl bg-zinc-50">{feature.icon}</div>
            <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
            <p className="text-sm text-zinc-500">{feature.desc}</p>
          </Card>
        ))}
      </motion.div>
    </div>
  );

  const renderUpload = () => (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <div className="mb-10">
        <button 
          onClick={() => setStep('landing')}
          className="text-sm text-zinc-500 hover:text-zinc-900 mb-4 flex items-center gap-1"
        >
          <ChevronRight size={14} className="rotate-180" /> Back to Home
        </button>
        <h2 className="text-3xl font-bold mb-2">Submit Your Resume</h2>
        <p className="text-zinc-500">Choose how you'd like to provide your resume details.</p>
      </div>

      <div className="space-y-8">
        <section>
          <label className="block text-sm font-bold mb-3">Select Target Job Role</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {JOB_ROLES.map((role) => (
              <button
                key={role}
                onClick={() => setJobRole(role)}
                className={cn(
                  "px-4 py-2 rounded-lg text-xs font-medium border transition-all",
                  jobRole === role 
                    ? "bg-zinc-900 border-zinc-900 text-white" 
                    : "bg-white border-zinc-200 text-zinc-600 hover:border-zinc-400"
                )}
              >
                {role}
              </button>
            ))}
          </div>
        </section>

        <section>
          <label className="block text-sm font-bold mb-3">Upload Resume File</label>
          <FileUpload 
            onTextExtracted={(text) => setResumeText(text)} 
            onFileSelect={() => {}} 
          />
        </section>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-zinc-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-zinc-500">Or paste text</span>
          </div>
        </div>

        <section>
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume content here..."
            className="w-full h-64 p-4 rounded-2xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 resize-none text-sm"
          />
        </section>

        <Button 
          size="lg" 
          className="w-full gap-2" 
          onClick={handleStartAnalysis}
          isLoading={isAnalyzing}
        >
          {isAnalyzing ? "Analyzing Resume..." : "Start AI Analysis"}
        </Button>
      </div>
    </div>
  );

  const renderAnalysis = () => {
    if (!analysis) return null;

    const tabs: { id: AnalysisTab; label: string; icon: any }[] = [
      { id: 'skills', label: 'Skills', icon: <Target size={18} /> },
      { id: 'evaluation', label: 'Evaluation', icon: <BarChart3 size={18} /> },
      { id: 'suggestions', label: 'Suggestions', icon: <Lightbulb size={18} /> },
      { id: 'optimization', label: 'Optimization', icon: <Rocket size={18} /> },
      { id: 'career', label: 'Insights', icon: <TrendingUp size={18} /> },
      { id: 'report', label: 'Final Report', icon: <FileText size={18} /> },
    ];

    return (
      <div className="max-w-6xl mx-auto py-12 px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-zinc-900">Analysis Results</h2>
            <p className="text-zinc-500">Target Role: <span className="font-semibold text-zinc-900">{jobRole}</span></p>
          </div>
          <Button variant="outline" onClick={() => setStep('upload')}>
            Analyze Another Resume
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 mb-8 p-1 bg-zinc-100 rounded-xl w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                activeTab === tab.id 
                  ? "bg-white text-zinc-900 shadow-sm" 
                  : "text-zinc-500 hover:text-zinc-900"
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'skills' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <BrainCircuit className="text-blue-500" /> Technical Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.skills.technical.map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </Card>
                <Card>
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Target className="text-emerald-500" /> Soft Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.skills.soft.map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </Card>
                <Card className="md:col-span-2">
                  <h3 className="text-lg font-bold mb-4">Experience & Education</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3">Experience</h4>
                      {analysis.experience.map((exp, i) => (
                        <div key={i} className="mb-4 last:mb-0 border-l-2 border-zinc-100 pl-4">
                          <p className="font-bold text-zinc-900">{exp.title}</p>
                          <p className="text-sm text-zinc-500">{exp.company} • {exp.duration}</p>
                          <ul className="mt-2 space-y-1">
                            {exp.highlights.map((h, j) => (
                              <li key={j} className="text-sm text-zinc-600 flex gap-2">
                                <span className="text-zinc-300">•</span> {h}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3">Education</h4>
                      {analysis.education.map((edu, i) => (
                        <div key={i} className="mb-2">
                          <p className="font-bold text-zinc-900">{edu.degree}</p>
                          <p className="text-sm text-zinc-500">{edu.institution} • {edu.year}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'evaluation' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="flex flex-col items-center justify-center text-center py-10">
                  <p className="text-sm font-medium text-zinc-500 mb-2">Resume Score</p>
                  <div className="relative flex items-center justify-center">
                    <svg className="w-32 h-32">
                      <circle className="text-zinc-100" strokeWidth="8" stroke="currentColor" fill="transparent" r="58" cx="64" cy="64" />
                      <circle 
                        className="text-zinc-900" 
                        strokeWidth="8" 
                        strokeDasharray={364.4} 
                        strokeDashoffset={364.4 - (364.4 * analysis.evaluation.score) / 100} 
                        strokeLinecap="round" 
                        stroke="currentColor" 
                        fill="transparent" 
                        r="58" cx="64" cy="64" 
                      />
                    </svg>
                    <span className="absolute text-3xl font-bold">{analysis.evaluation.score}</span>
                  </div>
                </Card>
                <Card className="md:col-span-2">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-xs font-bold text-zinc-400 uppercase mb-1">Match Percentage</p>
                      <p className="text-2xl font-bold text-emerald-600">{analysis.evaluation.matchPercentage}%</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-400 uppercase mb-1">Experience Level</p>
                      <p className="text-2xl font-bold text-zinc-900">{analysis.evaluation.experienceLevel}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-bold mb-2 flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-emerald-500" /> Strengths
                      </h4>
                      <ul className="space-y-1">
                        {analysis.evaluation.strengths.map((s, i) => (
                          <li key={i} className="text-sm text-zinc-600">• {s}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold mb-2 flex items-center gap-2">
                        <X size={16} className="text-red-500" /> Areas for Improvement
                      </h4>
                      <ul className="space-y-1">
                        {analysis.evaluation.weaknesses.map((w, i) => (
                          <li key={i} className="text-sm text-zinc-600">• {w}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'suggestions' && (
              <Card>
                <h3 className="text-lg font-bold mb-6">AI Improvement Suggestions</h3>
                <div className="space-y-4">
                  {analysis.suggestions.map((suggestion, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-xl bg-amber-50 border border-amber-100">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center text-amber-700 font-bold text-sm">
                        {i + 1}
                      </div>
                      <p className="text-zinc-800 text-sm leading-relaxed">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {activeTab === 'optimization' && (
              <div className="space-y-6">
                <Card>
                  <h3 className="text-lg font-bold mb-4">Recommended Keywords</h3>
                  <p className="text-sm text-zinc-500 mb-4">Add these keywords to your resume to pass ATS filters for {jobRole} roles.</p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.optimization.keywords.map((kw, i) => (
                      <span key={i} className="px-3 py-1 bg-zinc-100 text-zinc-700 rounded-lg text-xs font-semibold">
                        {kw}
                      </span>
                    ))}
                  </div>
                </Card>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <h3 className="text-lg font-bold mb-4">Skills to Add</h3>
                    <ul className="space-y-2">
                      {analysis.optimization.recommendedSkills.map((skill, i) => (
                        <li key={i} className="text-sm text-zinc-600 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {skill}
                        </li>
                      ))}
                    </ul>
                  </Card>
                  <Card>
                    <h3 className="text-lg font-bold mb-4">Formatting Tips</h3>
                    <ul className="space-y-2">
                      {analysis.optimization.formattingTips.map((tip, i) => (
                        <li key={i} className="text-sm text-zinc-600 flex items-start gap-2">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" /> {tip}
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'career' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                  <h3 className="text-lg font-bold mb-6">Career Guidance</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3">Trending Technologies</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysis.careerInsights.trendingTech.map((tech, i) => (
                          <span key={i} className="px-3 py-1 bg-violet-50 text-violet-700 rounded-full text-xs font-medium">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-1">Salary Insights</h4>
                        <p className="text-xl font-bold text-zinc-900">{analysis.careerInsights.salaryRange}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-1">Growth Potential</h4>
                        <p className="text-xl font-bold text-zinc-900">{analysis.careerInsights.growthPotential}</p>
                      </div>
                    </div>
                  </div>
                </Card>
                <Card className="bg-zinc-900 text-white border-none">
                  <h3 className="text-lg font-bold mb-4">Pro Tip</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    "The job market for {jobRole} is evolving. Focus on building a portfolio that showcases your ability to solve real-world problems using the trending technologies identified."
                  </p>
                  <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-xs font-bold text-zinc-500 uppercase mb-2">Next Step</p>
                    <p className="text-sm">Apply for 3 roles this week with your optimized resume.</p>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'report' && (
              <Card className="p-10">
                <div className="flex justify-between items-start mb-10 pb-6 border-bottom border-zinc-100">
                  <div>
                    <h1 className="text-2xl font-bold">Resume Evaluation Report</h1>
                    <p className="text-zinc-500">Generated by AI Resume Screening System</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-zinc-400 uppercase">Date</p>
                    <p className="text-sm font-medium">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div>
                    <h3 className="text-sm font-bold text-zinc-400 uppercase mb-4">Executive Summary</h3>
                    <div className="p-6 rounded-2xl bg-zinc-50 mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium">Overall Score</span>
                        <span className="text-2xl font-bold">{analysis.evaluation.score}/100</span>
                      </div>
                      <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-zinc-900 h-full" style={{ width: `${analysis.evaluation.score}%` }} />
                      </div>
                    </div>
                    <p className="text-sm text-zinc-600 leading-relaxed">
                      Your resume shows a <span className="font-bold text-zinc-900">{analysis.evaluation.matchPercentage}% match</span> for the <span className="font-bold text-zinc-900">{jobRole}</span> position. 
                      You demonstrate strong capabilities in {analysis.skills.technical.slice(0, 3).join(', ')}.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-bold text-zinc-400 uppercase mb-2">Top Strengths</h3>
                      <ul className="space-y-1">
                        {analysis.evaluation.strengths.slice(0, 3).map((s, i) => (
                          <li key={i} className="text-sm text-zinc-600 flex items-center gap-2">
                            <CheckCircle2 size={14} className="text-emerald-500" /> {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-zinc-400 uppercase mb-2">Key Recommendations</h3>
                      <ul className="space-y-1">
                        {analysis.suggestions.slice(0, 3).map((s, i) => (
                          <li key={i} className="text-sm text-zinc-600 flex items-start gap-2">
                            <div className="mt-1.5 w-1 h-1 rounded-full bg-zinc-900 flex-shrink-0" /> {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-zinc-100 flex justify-center gap-4">
                  <Button onClick={() => window.print()} variant="outline" className="gap-2">
                    <FileText size={18} /> Print Report
                  </Button>
                  <Button onClick={() => setStep('upload')} className="gap-2">
                    <Rocket size={18} /> Improve & Resubmit
                  </Button>
                </div>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white">
      <header className="border-b border-zinc-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => setStep('landing')}
          >
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-white font-bold">
              R
            </div>
            <span className="font-bold tracking-tight">AI SCREENER</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <button onClick={() => setStep('landing')} className="text-sm font-medium text-zinc-500 hover:text-zinc-900">Home</button>
            <button onClick={() => setStep('upload')} className="text-sm font-medium text-zinc-500 hover:text-zinc-900">Analyze</button>
            <button className="text-sm font-medium text-zinc-500 hover:text-zinc-900">Tips</button>
          </nav>
          <Button size="sm" onClick={() => setStep('upload')}>Get Started</Button>
        </div>
      </header>

      <main>
        {step === 'landing' && renderLanding()}
        {step === 'upload' && renderUpload()}
        {step === 'analysis' && renderAnalysis()}
      </main>

      <footer className="border-t border-zinc-100 py-12 px-6 mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-zinc-900 rounded flex items-center justify-center text-white font-bold text-xs">
                R
              </div>
              <span className="font-bold tracking-tight">AI SCREENER</span>
            </div>
            <p className="text-sm text-zinc-500 max-w-xs">
              Empowering job seekers with AI-driven resume analysis and career guidance.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold mb-4">Product</h4>
            <ul className="space-y-2">
              <li><button className="text-sm text-zinc-500 hover:text-zinc-900">Features</button></li>
              <li><button className="text-sm text-zinc-500 hover:text-zinc-900">Pricing</button></li>
              <li><button className="text-sm text-zinc-500 hover:text-zinc-900">API</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><button className="text-sm text-zinc-500 hover:text-zinc-900">About</button></li>
              <li><button className="text-sm text-zinc-500 hover:text-zinc-900">Blog</button></li>
              <li><button className="text-sm text-zinc-500 hover:text-zinc-900">Contact</button></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-zinc-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-zinc-400">© 2026 AI Resume Screening System. All rights reserved.</p>
          <div className="flex gap-6">
            <button className="text-xs text-zinc-400 hover:text-zinc-900">Privacy Policy</button>
            <button className="text-xs text-zinc-400 hover:text-zinc-900">Terms of Service</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
