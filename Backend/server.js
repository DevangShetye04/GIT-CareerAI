const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const studentRoutes = require("./routes/studentRoutes");
const resumeRoutes = require("./routes/resumeRoutes");

dotenv.config();

const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/students", studentRoutes);
app.use("/api/students", resumeRoutes);

// Test route
app.get("/", (req, res) => {
    res.json({
        message: "GIT CareerAI Backend is running"
    });
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});