const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            required: true,
            index: true
        },

        title: {
            type: String,
            required: true
        },

        department: {
            type: String,
            default: ""
        },

        jobType: {
            type: String,
            default: "Full-Time"
        },

        workMode: {
            type: String,
            default: "Hybrid"
        },

        location: {
            type: String,
            default: ""
        },

        ctc: {
            type: String,
            default: ""
        },

        vacancies: {
            type: Number,
            default: 1
        },

        joiningDate: {
            type: String,
            default: ""
        },

        deadline: {
            type: String,
            required: true
        },

        selectionProcess: {
            type: String,
            default: ""
        },

        interviewMode: {
            type: String,
            default: ""
        },

        minCgpa: {
            type: Number,
            default: 0
        },

        allowedBacklogs: {
            type: Number,
            default: 0
        },

        graduationYear: {
            type: String,
            default: ""
        },

        allowedBranches: {
            type: [String],
            default: []
        },

        description: {
            type: String,
            required: true
        },

        requiredSkills: {
            type: [String],
            default: []
        },

        preferredSkills: {
            type: [String],
            default: []
        },

        status: {
            type: String,
            enum: ["Draft", "Active", "Closed", "Rejected"],
            default: "Draft"
        },

        deadlineLabel: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Job", jobSchema);