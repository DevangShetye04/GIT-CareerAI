const mongoose = require("mongoose");

const atsAnalysisSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true
        },

        resumeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Resume",
            required: true
        },

        overallScore: {
            type: Number,
            min: 0,
            max: 100
        },

        lastAnalyzed: {
            type: Date,
            default: Date.now
        },

        breakdown: {
            formatting: {
                score: Number,
                maxScore: Number,
                issues: [String],
                passed: Boolean
            },

            contentCompleteness: {
                score: Number,
                maxScore: Number,
                sections: mongoose.Schema.Types.Mixed,
                passed: Boolean
            },

            keywordOptimization: {
                score: Number,
                maxScore: Number,
                matched: [String],
                missing: [String],
                suggestions: [String],
                passed: Boolean
            },

            impactMetrics: {
                score: Number,
                maxScore: Number,
                quantifiableAchievements: Number,
                actionVerbs: Number,
                recommendations: [String],
                passed: Boolean
            }
        },

        recommendations: [
            {
                priority: String,
                category: String,
                message: String,
                impact: String
            }
        ],

        compatibilityByRole: {
            type: Map,
            of: Number
        }
    },

    {
        timestamps: true
    }
);

module.exports = mongoose.model("ATSAnalysis", atsAnalysisSchema);