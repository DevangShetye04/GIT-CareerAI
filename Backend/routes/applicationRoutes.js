const express = require("express");
const Application = require("../models/Application");
const Student = require("../models/Student");
const Job = require("../models/Job");
const Company = require("../models/Company");
const Resume = require("../models/Resume");
const ATSAnalysis = require("../models/ATSAnalysis");

const router = express.Router();

function computeEligibility(student, job) {
    const passesCgpa = (student.cgpa || 0) >= (job.minCgpa || 0);
    const passesBacklogs = (student.backlogs || 0) <= (job.allowedBacklogs || 0);
    const passesBranch =
        !job.allowedBranches ||
        job.allowedBranches.length === 0 ||
        job.allowedBranches.includes(student.branch);

    return {
        eligible: passesCgpa && passesBacklogs && passesBranch,
        passesCgpa,
        passesBacklogs,
        passesBranch,
    };
}

function formatAppliedDate(date = new Date()) {
    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

// POST /api/applications
router.post("/", async (req, res) => {
    try {
        const { studentUserId, jobId } = req.body;

        if (!studentUserId || !jobId) {
            return res.status(400).json({
                message: "studentUserId and jobId are required",
            });
        }

        const student = await Student.findOne({ userId: studentUserId });
        if (!student) {
            return res.status(404).json({ message: "Student profile not found" });
        }

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        if (job.status !== "Active") {
            return res.status(400).json({
                message: `This job opening is ${job.status.toLowerCase()} and is no longer accepting applications.`,
            });
        }

        const existing = await Application.findOne({
            studentUserId,
            jobId: job._id,
        });

        if (existing) {
            return res.status(400).json({
                message: "You have already applied for this job.",
            });
        }

        const eligibility = computeEligibility(student, job);
        if (!eligibility.eligible) {
            return res.status(400).json({
                message: "You do not meet the academic eligibility criteria required by this recruiter.",
            });
        }

        const company = await Company.findById(job.companyId);
        const resume = await Resume.findOne({
            studentId: student._id,
            isCurrent: true,
        }).sort({ createdAt: -1 });

        if (!resume) {
            return res.status(400).json({
                message: "Please upload your resume before applying for campus job openings.",
            });
        }

        const analysis = await ATSAnalysis.findOne({
            studentId: student._id,
        }).sort({ createdAt: -1 });

        const application = await Application.create({
            studentId: student._id,
            studentUserId,
            jobId: job._id,
            companyId: job.companyId,
            companyUserId: company?.userId || "",
            resumeId: resume._id,
            status: "Applied",
            eligible: eligibility.eligible,
            atsScore: analysis?.overallScore || 0,
            name: student.name || "",
            email: student.email || "",
            phone: student.phone || "",
            role: job.title,
            branch: student.branch || "",
            college: student.college || "",
            cgpa: student.cgpa || 0,
            backlogs: student.backlogs || 0,
            graduationYear: student.graduationYear ? String(student.graduationYear) : "",
            skills: student.skills || [],
            appliedDate: formatAppliedDate(),
        });

        res.status(201).json(application);
    } catch (error) {
        console.error("CREATE APPLICATION ERROR:", error);

        if (error.code === 11000) {
            return res.status(400).json({
                message: "You have already applied for this job.",
            });
        }

        res.status(400).json({ message: error.message });
    }
});

// GET /api/applications/company/:userId
router.get("/company/:userId", async (req, res) => {
    try {
        const applications = await Application.find({
            companyUserId: req.params.userId,
        })
            .populate("jobId")
            .populate("studentId")
            .populate("resumeId")
            .sort({ createdAt: -1 });

        res.json(applications);
    } catch (error) {
        console.error("GET COMPANY APPLICATIONS ERROR:", error);
        res.status(500).json({ message: error.message });
    }
});

// GET /api/applications/student/:userId
router.get("/student/:userId", async (req, res) => {
    try {
        const applications = await Application.find({
            studentUserId: req.params.userId,
        })
            .populate("jobId")
            .populate("companyId")
            .sort({ createdAt: -1 });

        res.json(applications);
    } catch (error) {
        console.error("GET STUDENT APPLICATIONS ERROR:", error);
        res.status(500).json({ message: error.message });
    }
});

// GET /api/applications/job/:jobId
router.get("/job/:jobId", async (req, res) => {
    try {
        const applications = await Application.find({
            jobId: req.params.jobId,
        })
            .populate("studentId")
            .sort({ createdAt: -1 });

        res.json(applications);
    } catch (error) {
        console.error("GET JOB APPLICATIONS ERROR:", error);
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/applications/:id/status
router.put("/:id/status", async (req, res) => {
    try {
        const { status, interviewDate, interviewMode } = req.body;

        const current = await Application.findById(req.params.id);
        if (!current) {
            return res.status(404).json({ message: "Application not found" });
        }

        if (current.status === "Rejected") {
            return res.status(400).json({
                message: "Rejected applications cannot change status.",
            });
        }

        const updates = {};
        if (status) updates.status = status;
        if (interviewDate !== undefined) updates.interviewDate = interviewDate;
        if (interviewMode !== undefined) updates.interviewMode = interviewMode;

        if (status === "Shortlisted" && !current.shortlistedDate) {
            updates.shortlistedDate = formatAppliedDate();
        }

        const application = await Application.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        );

        res.json(application);
    } catch (error) {
        console.error("UPDATE APPLICATION STATUS ERROR:", error);
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
