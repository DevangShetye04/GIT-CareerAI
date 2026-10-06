const express = require("express");
const Student = require("../models/Student");

const router = express.Router();

// GET all students
router.get("/", async (req, res) => {
    try {
        const students = await Student.find();

        res.json(students);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// GET student by ID
router.get("/:id", async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json(student);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// CREATE student
router.post("/", async (req, res) => {
    try {
        const student = await Student.create(req.body);

        res.status(201).json(student);

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// UPDATE student
router.put("/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json(student);

    } catch (error) {
        console.error("UPDATE ERROR:", error.message);

        res.status(400).json({
            message: error.message
        });
    }
});


module.exports = router;