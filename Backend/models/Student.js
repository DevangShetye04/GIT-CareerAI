const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true
        },

        phone: {
            type: String,
            default: ""
        },

        location: {
            type: String,
            default: ""
        },

        college: {
            type: String,
            default: ""
        },

        branch: {
            type: String,
            default: ""
        },

        graduationYear: {
            type: Number
        },

        semester: {
            type: String,
            default: ""
        },

        cgpa: {
            type: Number
        },

        backlogs: {
            type: Number,
            default: 0
        },

        rollNo: {
            type: String,
            default: ""
        },

        // Technical skills
        skills: {
            type: [String],
            default: []
        },

        // Soft skills
        softSkills: {
            type: [String],
            default: []
        },

        // Projects
        projects: [
            {
                id: String,
                name: String,
                description: String,
                technologies: [String]
            }
        ],

        // Work / internship experience
        experience: [
            {
                id: String,
                role: String,
                company: String,
                duration: String,
                description: String
            }
        ],

        // Career preferences
        preferences: {
            preferredRole: {
                type: String,
                default: ""
            },

            targetPackage: {
                type: String,
                default: ""
            },

            workModes: {
                type: [String],
                default: []
            },

            preferredLocations: {
                type: [String],
                default: []
            }
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Student", studentSchema);