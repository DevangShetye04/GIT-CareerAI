import { useState, useEffect, useRef } from "react";
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Eye,
  RefreshCw,
  Award,
  Sparkles,
  ArrowUpRight,
  Download,
  Info,
} from "lucide-react";
import Card from "../../components/ui/Card.jsx";
import Pill from "../../components/ui/Pill.jsx";
import Button from "../../components/ui/Button.jsx";
import {
  getResumeData,
  uploadResume,
  removeResume,
  subscribe,
} from "../../services/studentService.js";

export default function StudentResume() {
  const [resume, setResume] = useState(getResumeData());
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [successToast, setSuccessToast] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    const unsub = subscribe(() => {
      setResume(getResumeData());
    });
    return () => unsub();
  }, []);

  const handleFileSelection = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = (file) => {
    setUploadError("");
    setSuccessToast("");

    // Validate type: PDF only
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setUploadError("Only PDF format (.pdf) is supported for automated ATS parsing.");
      return;
    }

    // Validate size: max 5MB
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError("File size exceeds 5MB limit. Please upload a smaller PDF.");
      return;
    }

    const formatSize = (bytes) => {
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    setIsUploading(true);

    // Simulate ATS extraction & scanning
    setTimeout(() => {
      const generatedScore = Math.floor(Math.random() * 15) + 82; // 82 - 96
      uploadResume({
        fileName: file.name,
        fileSize: formatSize(file.size),
        atsScore: generatedScore,
      });
      setIsUploading(false);
      setSuccessToast(`"${file.name}" uploaded and parsed successfully!`);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }, 1200);
  };

  const handleRemove = () => {
    removeResume();
    setSuccessToast("Resume removed.");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
            Resume &amp; ATS Score
          </h1>
          <p className="font-body text-sm text-ink-soft mt-1">
            Keep your resume updated for automated campus placement shortlisting and ATS screening.
          </p>
        </div>
        {resume.hasResume && (
          <Button
            variant="ghost"
            onClick={() => fileInputRef.current?.click()}
            className="self-start sm:self-auto"
          >
            <RefreshCw size={15} /> Replace Resume
          </Button>
        )}
      </div>

      {/* Success Toast */}
      {successToast && (
        <div className="p-4 rounded-xl bg-teal-soft text-teal-dark border border-teal/20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium">
            <CheckCircle2 size={18} />
            <span>{successToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessToast("")}
            className="text-xs font-semibold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Error Message */}
      {uploadError && (
        <div className="p-4 rounded-xl bg-coral-soft text-coral-dark border border-coral/20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium">
            <AlertTriangle size={18} />
            <span>{uploadError}</span>
          </div>
          <button
            type="button"
            onClick={() => setUploadError("")}
            className="text-xs font-semibold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelection}
        accept="application/pdf,.pdf"
        className="hidden"
      />

      {/* Upload Dropzone if no resume OR if replacing */}
      {!resume.hasResume ? (
        <Card className="border-2 border-dashed border-line p-8 text-center hover:border-ink/40 transition-colors">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="flex flex-col items-center justify-center cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-16 h-16 rounded-2xl bg-amber-soft text-amber-dark flex items-center justify-center mb-4">
              <UploadCloud size={32} />
            </div>
            <h3 className="font-display text-lg font-semibold text-ink">
              Upload your placement resume
            </h3>
            <p className="font-body text-sm text-ink-soft max-w-md mt-1 mb-4">
              Drag and drop your PDF file here, or click to browse. Max size 5MB. Must be standard single or double-column format.
            </p>
            <Button variant="primary" loading={isUploading}>
              <UploadCloud size={16} /> Upload Resume
            </Button>
          </div>
        </Card>
      ) : (
        /* Resume Status Card */
        <Card>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-paper-dim border border-line flex items-center justify-center text-ink shrink-0">
                <FileText size={28} />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-lg font-semibold text-ink">
                    {resume.fileName}
                  </h3>
                  <Pill tone="teal">
                    <CheckCircle2 size={12} /> Active for Placements
                  </Pill>
                </div>
                <p className="font-body text-xs text-ink-soft mt-1">
                  Size: <span className="font-mono text-ink">{resume.fileSize}</span> • Uploaded on{" "}
                  <span className="font-mono text-ink">{resume.uploadedAtLabel}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button variant="ghost" onClick={() => setShowPreviewModal(true)}>
                <Eye size={15} /> View Resume
              </Button>
              <Button
                variant="ghost"
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud size={15} /> Replace Resume
              </Button>
              <Button
                variant="ghost"
                className="!text-coral hover:!bg-coral-soft hover:!border-coral/30"
                onClick={handleRemove}
              >
                <Trash2 size={15} /> Remove Resume
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* ATS Analysis Section */}
      {resume.hasResume && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main ATS Score */}
          <Card className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-body text-xs uppercase tracking-wider font-semibold text-ink-soft">
                  Overall ATS Readiness
                </span>
                <Pill tone="teal">
                  <Sparkles size={12} /> AI Audited
                </Pill>
              </div>
              <div className="flex items-center gap-5 my-4">
                <div className="w-20 h-20 rounded-full flex flex-col items-center justify-center bg-teal-soft text-teal-dark border-4 border-teal shrink-0">
                  <span className="font-mono text-2xl font-bold">{resume.atsScore}</span>
                  <span className="text-[10px] uppercase font-semibold">Score</span>
                </div>
                <div>
                  <h4 className="font-display text-base font-semibold text-ink">
                    High Placement Match
                  </h4>
                  <p className="font-body text-xs text-ink-soft mt-1">
                    Your resume exceeds 80% screening threshold for top tier tech companies on campus.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-line">
              <div className="font-body text-xs text-ink-soft flex items-center justify-between">
                <span>Placement Cell Benchmark</span>
                <span className="font-mono font-medium text-ink">75 / 100</span>
              </div>
            </div>
          </Card>

          {/* Breakdown by Category */}
          <Card className="lg:col-span-2">
            <h3 className="font-display text-base font-semibold text-ink mb-4">
              Category Breakdown
            </h3>
            <div className="space-y-4">
              {Object.entries(resume.scoreBreakdown || {}).map(([key, value]) => {
                const labelMap = {
                  formatting: "Document Structure & Layout",
                  skillsMatch: "Technical Keyword Match",
                  experience: "Projects & Internships Depth",
                  education: "Academic & Coursework Relevance",
                };
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between text-xs font-body mb-1">
                      <span className="font-medium text-ink">{labelMap[key] || key}</span>
                      <span className="font-mono text-ink-soft font-semibold">{value}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-paper-dim overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          value >= 85 ? "bg-teal" : value >= 70 ? "bg-amber" : "bg-coral"
                        }`}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* Strengths and Recommendations */}
      {resume.hasResume && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Award size={18} className="text-teal" />
              <h3 className="font-display text-base font-semibold text-ink">Resume Strengths</h3>
            </div>
            <ul className="space-y-3">
              {(resume.strengths || []).map((s, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs font-body text-ink">
                  <CheckCircle2 size={15} className="text-teal shrink-0 mt-0.5" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Info size={18} className="text-amber-dark" />
              <h3 className="font-display text-base font-semibold text-ink">
                Areas for Improvement
              </h3>
            </div>
            <ul className="space-y-3">
              {(resume.improvements || []).map((imp, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs font-body text-ink-soft">
                  <ArrowUpRight size={15} className="text-amber-dark shrink-0 mt-0.5" />
                  <span>{imp}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      {/* Resume Preview Modal */}
      {showPreviewModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in"
        >
          <div className="bg-card border border-line rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-line flex items-center justify-between bg-paper-dim">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-ink" />
                <span className="font-display text-sm font-semibold text-ink">
                  {resume.fileName} (Parsed Preview)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="p-1 rounded-lg hover:bg-line text-ink-soft hover:text-ink text-sm font-medium"
              >
                ✕ Close
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 font-body text-xs text-ink">
              <div className="border-b border-line pb-4">
                <h2 className="font-display text-xl font-bold text-ink">Bilal Madre</h2>
                <p className="text-ink-soft mt-0.5">
                  student@git.edu • +91 98234 56789 • Goa, India • linkedin.com/in/bilalmadre • github.com/bilalmadre
                </p>
              </div>

              <div>
                <h3 className="font-display font-semibold text-sm text-ink mb-1">Education</h3>
                <p className="font-medium">
                  Goa Institute of Technology — B.E. Computer Engineering (2022 - 2026)
                </p>
                <p className="text-ink-soft">CGPA: 8.7 / 10.0 • Department Rank: Top 10%</p>
              </div>

              <div>
                <h3 className="font-display font-semibold text-sm text-ink mb-1">Technical Skills</h3>
                <p className="text-ink-soft">
                  <strong className="text-ink">Languages:</strong> Java, JavaScript (ES6+), Python, SQL
                  <br />
                  <strong className="text-ink">Frameworks &amp; Web:</strong> React.js, Node.js, Express.js, Tailwind CSS
                  <br />
                  <strong className="text-ink">Databases &amp; Tools:</strong> PostgreSQL, MongoDB, Git, Docker, Postman
                </p>
              </div>

              <div>
                <h3 className="font-display font-semibold text-sm text-ink mb-1">Experience &amp; Projects</h3>
                <div className="mb-2">
                  <div className="font-medium text-ink">Full Stack Developer Intern — TechSolutions Inc</div>
                  <div className="text-ink-faint text-[11px]">June 2024 – August 2024</div>
                  <p className="text-ink-soft mt-0.5">
                    Built REST APIs using Express.js and PostgreSQL. Improved internal dashboard rendering speed by 25%.
                  </p>
                </div>
                <div>
                  <div className="font-medium text-ink">GIT CareerAI Placement Intelligence Platform</div>
                  <div className="text-ink-faint text-[11px]">Academic Capstone Project</div>
                  <p className="text-ink-soft mt-0.5">
                    Developed multi-tier role-based placement system with ATS matching and dynamic student-recruiter pipeline.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-line flex justify-end gap-2 bg-paper-dim">
              <Button variant="ghost" onClick={() => setShowPreviewModal(false)}>
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
