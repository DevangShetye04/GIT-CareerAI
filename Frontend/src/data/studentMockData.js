export const DEFAULT_STUDENT_PROFILE = {
  id: "student-001",
  fullName: "Bilal Madre",
  name: "Bilal Madre",
  email: "student@git.edu",
  phone: "+91 98234 56789",
  location: "Panaji, Goa",
  college: "Goa Institute of Technology (GIT)",
  branch: "Computer Engineering",
  semester: "8th Semester",
  graduationYear: "2026",
  cgpa: 8.7,
  rollNo: "22CE1045",
  backlogs: 0,
  technicalSkills: [
    "Java",
    "Python",
    "SQL",
    "React",
    "REST API",
    "Git",
    "HTML/CSS",
    "Tailwind CSS",
    "Data Structures",
  ],
  softSkills: [
    "Problem Solving",
    "Clear Communication",
    "Team Collaboration",
    "Critical Thinking",
    "Adaptability",
  ],
  projects: [
    {
      id: "p1",
      title: "GIT CareerAI Portal",
      description:
        "Comprehensive campus career and recruitment intelligence platform with ATS resume screening, placement eligibility gates, and recruiter pipelines.",
      technologies: ["React", "Tailwind CSS", "JavaScript", "LocalStorage"],
      link: "https://github.com/bilalmadre/git-careerai",
    },
    {
      id: "p2",
      title: "Distributed Task Scheduler",
      description:
        "Fault-tolerant microservice architecture for asynchronous background job execution with distributed locking, scheduling metrics, and error retries.",
      technologies: ["Java", "Spring Boot", "PostgreSQL", "Docker", "REST API"],
      link: "https://github.com/bilalmadre/task-scheduler",
    },
  ],
  experience: [
    {
      id: "e1",
      company: "TechnoSoft Solutions",
      role: "Software Engineering Intern",
      duration: "Jan 2025 - Jun 2025",
      location: "Panaji, Goa",
      description:
        "Contributed to enterprise REST services, optimized SQL query plans, and authored unit tests improving automated code coverage by 24%.",
    },
  ],
  preferences: {
    preferredRole: "Java Backend Developer",
    targetPackage: "₹7.5 - 10.0 LPA",
    workModes: ["Hybrid", "On-site"],
    preferredLocations: ["Mumbai", "Pune", "Bangalore", "Goa"],
  },
};

export const DEFAULT_STUDENT_RESUME = {
  hasResume: true,
  fileName: "Bilal_Madre_Resume.pdf",
  fileSize: "348 KB",
  uploadedAt: "2026-08-14T10:30:00.000Z",
  uploadedAtLabel: "14 Aug 2026",
  atsScore: 88,
  scoreBreakdown: {
    formatting: 92,
    skillsMatch: 86,
    experience: 85,
    education: 90,
  },
  strengths: [
    "Strong core Java, RESTful API architecture, and database relational design",
    "Proven practical project work in full-stack and microservice engineering",
    "High academic consistency with 8.7 CGPA and zero standing backlogs",
  ],
  improvements: [
    "Add cloud platform deployment projects (AWS, Azure, or GCP)",
    "Quantify impact metrics and performance benchmarks in project descriptions",
  ],
};

export const INITIAL_STUDENT_APPLICATIONS = [
  {
    id: "app-1",
    jobId: 1,
    company: "Tata Consultancy Services (TCS)",
    role: "Java Developer",
    location: "Mumbai",
    ctc: "₹7.5 - 9.0 LPA",
    workMode: "Hybrid",
    appliedDate: "18 Aug 2026",
    appliedDateLabel: "18 Aug 2026",
    status: "Shortlisted",
    interviewDate: "2026-09-24T11:00",
    interviewDateLabel: "24 Sep 2026, 11:00 AM",
    interviewMode: "Virtual (Google Meet)",
    interviewRound: "Technical Interview Round 1",
  },
  {
    id: "app-2",
    jobId: 3,
    company: "Tata Consultancy Services (TCS)",
    role: "Backend Developer",
    location: "Bangalore",
    ctc: "₹7.0 - 8.5 LPA",
    workMode: "Hybrid",
    appliedDate: "10 Aug 2026",
    appliedDateLabel: "10 Aug 2026",
    status: "Under Review",
    interviewDate: null,
    interviewDateLabel: null,
    interviewMode: null,
    interviewRound: null,
  },
];

export const INITIAL_STUDENT_INTERVIEWS = [
  {
    id: "int-1",
    applicationId: "app-1",
    jobId: 1,
    company: "Tata Consultancy Services (TCS)",
    role: "Java Developer",
    round: "Technical Interview Round 1",
    date: "2026-09-24",
    time: "11:00 AM",
    dateTime: "2026-09-24T11:00",
    dateLabel: "24 Sep 2026, 11:00 AM",
    mode: "Virtual (Google Meet)",
    meetingLink: "https://meet.google.com/git-tcs-campus",
    interviewer: "Priyanka Sharma (Campus Lead) & Technical Panel",
    instructions:
      "Keep your college identity card and updated resume ready. Ensure a stable internet connection and quiet environment. Be prepared for live data structures and Java coding questions.",
    status: "Scheduled",
  },
];

export const STUDENT_CAREER_ROLES = [
  {
    id: "role-1",
    title: "Java Backend Developer",
    matchScore: 88,
    category: "Software Development",
    avgCtc: "₹7.0 - 11.0 LPA",
    growth: "High Demand",
    description:
      "Build enterprise-grade microservices, high-throughput REST APIs, and scalable backend platforms using Java, Spring Boot, and cloud databases.",
    coreCompetencies: ["Java", "Spring Boot", "SQL", "REST API", "Git", "Microservices"],
  },
  {
    id: "role-2",
    title: "Full Stack Engineer",
    matchScore: 78,
    category: "Web Engineering",
    avgCtc: "₹6.5 - 10.5 LPA",
    growth: "Very High Demand",
    description:
      "Develop responsive user interfaces using React and modern CSS coupled with robust server-side APIs and distributed database systems.",
    coreCompetencies: ["React", "JavaScript", "Java/Node.js", "SQL", "Tailwind CSS"],
  },
  {
    id: "role-3",
    title: "Cloud & DevOps Associate",
    matchScore: 70,
    category: "Cloud Infrastructure",
    avgCtc: "₹6.0 - 9.5 LPA",
    growth: "Growing",
    description:
      "Automate deployment pipelines, orchestrate containerized applications using Docker and Kubernetes, and monitor production reliability.",
    coreCompetencies: ["Linux", "Docker", "AWS", "CI/CD", "Python/Bash", "Networking"],
  },
];

export const STUDENT_SKILL_GAP_DATA = {
  targetRole: "Java Backend Developer",
  readinessScore: 82,
  matchedSkills: [
    { name: "Java (Core & OOP)", status: "Proficient", level: 90 },
    { name: "SQL & RDBMS", status: "Proficient", level: 85 },
    { name: "RESTful API Design", status: "Proficient", level: 80 },
    { name: "Data Structures & Algorithms", status: "Competent", level: 75 },
    { name: "Git Version Control", status: "Proficient", level: 90 },
  ],
  missingSkills: [
    {
      name: "Spring Boot & Spring Cloud",
      importance: "High Priority",
      recommendedAction: "Build a multi-service project with Spring Data JPA & Eureka.",
    },
    {
      name: "Docker Containerization",
      importance: "Medium Priority",
      recommendedAction: "Containerize existing backend apps with multi-stage Dockerfiles.",
    },
    {
      name: "AWS Cloud Fundamentals (S3, EC2)",
      importance: "Medium Priority",
      recommendedAction: "Deploy a Spring Boot container on AWS ECS or EC2.",
    },
  ],
  roadmapSteps: [
    {
      step: 1,
      title: "Core Java & Concurrency Mastery",
      status: "Completed",
      duration: "Month 1-2",
    },
    {
      step: 2,
      title: "Spring Boot Microservices & JPA",
      status: "In Progress",
      duration: "Month 3-4",
    },
    {
      step: 3,
      title: "Dockerization & CI/CD Pipelines",
      status: "Upcoming",
      duration: "Month 5",
    },
    {
      step: 4,
      title: "System Design & Mock Placement Interviews",
      status: "Upcoming",
      duration: "Month 6",
    },
  ],
};

export const INITIAL_STUDENT_NOTIFICATIONS = [
  {
    id: "snotif-1",
    title: "Interview Scheduled: TCS Java Developer",
    message:
      "Tata Consultancy Services has scheduled Technical Interview Round 1 on 24 Sep 2026 at 11:00 AM via Google Meet.",
    timestamp: "2 hours ago",
    category: "interview",
    read: false,
    link: "/interviews",
  },
  {
    id: "snotif-2",
    title: "Application Shortlisted!",
    message:
      "Congratulations! Your application for Java Developer at TCS has been shortlisted by the campus recruiting lead.",
    timestamp: "1 day ago",
    category: "application",
    read: false,
    link: "/applications",
  },
  {
    id: "snotif-3",
    title: "New Campus Opening: Frontend Developer",
    message:
      "TCS has published a new campus placement drive for Frontend Developer (React). Applications close on 25 Sep 2026.",
    timestamp: "2 days ago",
    category: "job",
    read: true,
    link: "/jobs/2",
  },
  {
    id: "snotif-4",
    title: "Placement Cell Notice: Resume Verification",
    message:
      "Placement Cell requests all 2026 graduating batch students to ensure their latest PDF resume is uploaded before upcoming campus drives.",
    timestamp: "3 days ago",
    category: "system",
    read: true,
    link: "/resume",
  },
];
