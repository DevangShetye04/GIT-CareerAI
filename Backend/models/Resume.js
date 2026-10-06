/*const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true
        },

        filename: {
            type: String,
            required: true
        },

        originalName: {
            type: String,
            required: true
        },

        filePath: {
            type: String,
            required: true
        },

        fileSize: {
            type: Number
        },

        mimeType: {
            type: String
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Resume", resumeSchema);*/

const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true
        },

        fileName: {
            type: String,
            required: true
        },

        originalName: {
            type: String,
            required: true
        },

        filePath: {
            type: String,
            required: true
        },

        fileSize: {
            type: Number
        },

        fileType: {
            type: String
        },

        uploadedAt: {
            type: Date,
            default: Date.now
        },

        isCurrent: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Resume", resumeSchema);