const express = require("express");
const Company = require("../models/Company");

const router = express.Router();


// ==========================================
// GET COMPANY BY USER ID
// GET /api/companies/user/:userId
// ==========================================

router.get("/user/:userId", async (req, res) => {
    try {
        const company = await Company.findOne({
            userId: req.params.userId
        });

        if (!company) {
            return res.status(404).json({
                message: "Company profile not found"
            });
        }

        res.json(company);

    } catch (error) {
        console.error("GET COMPANY BY USER ERROR:", error);

        res.status(500).json({
            message: error.message
        });
    }
});


// ==========================================
// CREATE COMPANY
// POST /api/companies
// ==========================================

router.post("/", async (req, res) => {
    try {
        const company = await Company.create(req.body);

        res.status(201).json(company);

    } catch (error) {
        console.error("CREATE COMPANY ERROR:", error);

        res.status(400).json({
            message: error.message
        });
    }
});


// ==========================================
// UPDATE COMPANY BY USER ID
// PUT /api/companies/user/:userId
// ==========================================

router.put("/user/:userId", async (req, res) => {
    try {
        const company = await Company.findOneAndUpdate(
            {
                userId: req.params.userId
            },
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!company) {
            return res.status(404).json({
                message: "Company profile not found"
            });
        }

        res.json(company);

    } catch (error) {
        console.error("UPDATE COMPANY ERROR:", error);

        res.status(400).json({
            message: error.message
        });
    }
});


// ==========================================
// GET ALL COMPANIES
// GET /api/companies
// ==========================================

router.get("/", async (req, res) => {
    try {
        const companies = await Company.find();

        res.json(companies);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


module.exports = router;