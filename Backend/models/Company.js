const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            unique: true,
            index: true
        },

        companyName: {
            type: String,
            required: true
        },

        shortName: {
            type: String,
            default: ""
        },

        industry: {
            type: String,
            default: ""
        },

        companySize: {
            type: String,
            default: ""
        },

        website: {
            type: String,
            default: ""
        },

        headquarters: {
            type: String,
            default: ""
        },

        foundedYear: {
            type: String,
            default: ""
        },

        about: {
            type: String,
            default: ""
        },

        recruiterName: {
            type: String,
            default: ""
        },

        recruiterRole: {
            type: String,
            default: ""
        },

        recruiterEmail: {
            type: String,
            default: ""
        },

        phone: {
            type: String,
            default: ""
        },

        preferences: {
            branches: {
                type: [String],
                default: []
            },

            minCgpa: {
                type: Number,
                default: 0
            },

            graduationYear: {
                type: String,
                default: ""
            },

            maxBacklogs: {
                type: Number,
                default: 0
            },

            preferredLocations: {
                type: [String],
                default: []
            }
        },

        status: {
            type: String,
            default: "Pending Verification"
        },

        isVerified: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Company", companySchema);