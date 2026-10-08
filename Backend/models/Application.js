const mongoose = require("mongoose");

const APPLICATION_STATUSES = [
    "Applied",
    "Under Review",
    "Shortlisted",
    "Interview",
    "Selected",
    "Rejected",
];

const applicationSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
            index: true,
        },

        studentUserId: {
            type: String,
            required: true,
            index: true,
        },

        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
            index: true,
        },

        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            required: true,
            index: true,
        },

        companyUserId: {
            type: String,
            default: "",
            index: true,
        },

        resumeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Resume",
            default: null,
        },

        status: {
            type: String,
            enum: APPLICATION_STATUSES,
            default: "Applied",
        },

        eligible: {
            type: Boolean,
            default: false,
        },

        atsScore: {
            type: Number,
            default: 0,
        },

        name: { type: String, default: "" },
        email: { type: String, default: "" },
        phone: { type: String, default: "" },
        role: { type: String, default: "" },
        branch: { type: String, default: "" },
        college: { type: String, default: "" },
        cgpa: { type: Number, default: 0 },
        backlogs: { type: Number, default: 0 },
        graduationYear: { type: String, default: "" },
        skills: { type: [String], default: [] },
        appliedDate: { type: String, default: "" },
        shortlistedDate: { type: String, default: null },
        interviewDate: { type: String, default: null },
        interviewMode: { type: String, default: null },
        notes: { type: String, default: "" },
    },
    {
        timestamps: true,
    }
);

applicationSchema.index({ studentUserId: 1, jobId: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
module.exports.APPLICATION_STATUSES = APPLICATION_STATUSES;
