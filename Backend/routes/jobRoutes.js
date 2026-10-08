const express = require("express");
const Job = require("../models/Job");
const Company = require("../models/Company");

const router = express.Router();


// ==========================================
// CREATE JOB
// POST /api/jobs
// ==========================================

router.post("/", async (req, res) => {
    try {
        const job = await Job.create(req.body);

        res.status(201).json(job);

    } catch (error) {
        console.error("CREATE JOB ERROR:", error);

        res.status(400).json({
            message: error.message
        });
    }
});


// ==========================================
// GET JOBS FOR COMPANY
// GET /api/jobs/company/:userId
// ==========================================

router.get("/company/:userId", async (req, res) => {
    try {
        const company = await Company.findOne({
            userId: req.params.userId
        });

        if (!company) {
            return res.status(404).json({
                message: "Company profile not found"
            });
        }

        const jobs = await Job.find({
            companyId: company._id
        }).sort({
            createdAt: -1
        });

        res.json(jobs);

    } catch (error) {
        console.error("GET COMPANY JOBS ERROR:", error);

        res.status(500).json({
            message: error.message
        });
    }
});


// ==========================================
// GET SINGLE JOB
// GET /api/jobs/:id
// ==========================================

router.get("/:id", async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate("companyId");

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        res.json(job);

    } catch (error) {
        console.error("GET JOB ERROR:", error);

        res.status(500).json({
            message: error.message
        });
    }
});


// ==========================================
// UPDATE JOB
// PUT /api/jobs/:id
// ==========================================

router.put("/:id", async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        res.json(job);

    } catch (error) {
        console.error("UPDATE JOB ERROR:", error);

        res.status(400).json({
            message: error.message
        });
    }
});


// ==========================================
// DELETE JOB
// DELETE /api/jobs/:id
// ==========================================

router.delete("/:id", async (req, res) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);

        if (!job) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        res.json({
            message: "Job deleted successfully"
        });

    } catch (error) {
        console.error("DELETE JOB ERROR:", error);

        res.status(500).json({
            message: error.message
        });
    }
});


module.exports = router;