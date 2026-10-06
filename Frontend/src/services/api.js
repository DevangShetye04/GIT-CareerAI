const API_URL = "http://localhost:5000/api";

// GET student profile
export const getStudent = async (studentId) => {
    const response = await fetch(
        `${API_URL}/students/${studentId}`
    );

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));

        throw new Error(
            error.message || "Failed to fetch student"
        );
    }

    return await response.json();
};


// UPDATE student profile
export const updateStudent = async (studentId, studentData) => {
    const response = await fetch(
        `${API_URL}/students/${studentId}`,
        {
            method: "PUT",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify(studentData),
        }
    );

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));

        throw new Error(
            error.message || "Failed to update student"
        );
    }

    return await response.json();
};

export const getResume = async (studentId) => {
    const response = await fetch(
        `${API_URL}/students/${studentId}/resume`
    );

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));

        throw new Error(
            error.message || "Failed to fetch resume"
        );
    }

    return await response.json();
};


export const getATSAnalysis = async (studentId) => {
    const response = await fetch(
        `${API_URL}/students/${studentId}/resume/analysis`
    );

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));

        throw new Error(
            error.message || "Failed to fetch ATS analysis"
        );
    }

    return await response.json();
};


export const uploadResumeFile = async (studentId, file) => {

    const formData = new FormData();

    formData.append("resume", file);

    const response = await fetch(
        `${API_URL}/students/${studentId}/resume/upload`,
        {
            method: "POST",
            body: formData,
        }
    );

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));

        throw new Error(
            error.message || "Failed to upload resume"
        );
    }

    return await response.json();
};