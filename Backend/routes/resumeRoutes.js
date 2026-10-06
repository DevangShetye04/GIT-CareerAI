const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Resume = require("../models/Resume");
const ATSAnalysis = require("../models/ATSAnalysis");

const router = express.Router();


// -----------------------------
// Ensure uploads directory exists
// -----------------------------

const uploadDirectory = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
}


// -----------------------------
// Multer Configuration
// -----------------------------

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDirectory);
    },

    filename: function (req, file, cb) {

        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1E9) +
            path.extname(file.originalname);

        cb(null, uniqueName);
    }
});


const fileFilter = (req, file, cb) => {

    const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only PDF, DOC and DOCX files are allowed."));
    }
};


const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});


// -----------------------------
// Upload Resume
// POST /api/students/:studentId/resume/upload
// -----------------------------

router.post(
    "/:studentId/resume/upload",
    upload.single("resume"),
    async (req, res) => {

        try {

            if (!req.file) {
                return res.status(400).json({
                    message: "Resume file is required"
                });
            }

            const studentId = req.params.studentId;


            // Mark previous resumes as inactive
            await Resume.updateMany(
                { studentId },
                { isCurrent: false }
            );


            // Save new resume
            const resume = await Resume.create({
                studentId,

                filename: req.file.filename,

                originalName: req.file.originalname,

                filePath: req.file.path,

                fileSize: req.file.size,

                mimeType: req.file.mimetype,

                isCurrent: true
            });


            res.status(201).json({

                success: true,

                message: "Resume uploaded successfully",

                data: {
                    resume
                }

            });

        } catch (error) {

            console.error("RESUME UPLOAD ERROR:", error);

            res.status(500).json({
                message: error.message
            });
        }
    }
);


// -----------------------------
// Get Current Resume
// GET /api/students/:studentId/resume
// -----------------------------

router.get("/:studentId/resume", async (req, res) => {

    try {

        const resume = await Resume.findOne({
            studentId: req.params.studentId,
            isCurrent: true
        }).sort({ createdAt: -1 });


        if (!resume) {

            return res.status(404).json({
                message: "No resume found"
            });

        }


        res.json({

            success: true,

            data: resume

        });


    } catch (error) {

        console.error("GET RESUME ERROR:", error);

        res.status(500).json({
            message: error.message
        });
    }
});


// -----------------------------
// Get ATS Analysis
// GET /api/students/:studentId/resume/analysis
// -----------------------------

router.get("/:studentId/resume/analysis", async (req, res) => {

    try {

        const analysis = await ATSAnalysis.findOne({
            studentId: req.params.studentId
        })
            .sort({ createdAt: -1 })
            .populate("resumeId");


        if (!analysis) {

            return res.status(404).json({
                message: "No ATS analysis found"
            });

        }


        const result = analysis.toObject();


        res.json({

            success: true,

            data: {

                overallScore: result.overallScore,

                lastAnalyzed: result.lastAnalyzed,

                fileName:
                    result.resumeId?.originalName || "Resume",

                breakdown: result.breakdown,

                recommendations:
                    result.recommendations,

                /*compatibilityByRole:
                    result.compatibilityByRole*/

                compatibilityByRole:
                    result.compatibilityByRole
                    ? Object.fromEntries(result.compatibilityByRole)
                    : {}

            }

        });


    } catch (error) {

        console.error("GET ATS ERROR:", error);

        res.status(500).json({
            message: error.message
        });
    }
});


module.exports = router;