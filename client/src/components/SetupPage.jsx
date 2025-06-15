import React, { useState } from 'react';
import api from '../api'; // Import the api instance

// Props:
// - onStartInterview: function to call when the form is successfully submitted.
//   Takes the initial data from the backend response ({ session_id, question_text, question_index })

const SetupPage = ({ onStartInterview }) => {
  const [jobField, setJobField] = useState('');
  const [numQuestions, setNumQuestions] = useState(5); // Default to 5 questions
  const [experienceLevel, setExperienceLevel] = useState('');
  const [skills, setSkills] = useState(''); // Simple text input for skills initially
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    // Prepare data to send to the backend
    const setupData = {
      job_field: jobField,
      num_questions: parseInt(numQuestions, 10), // Ensure it's an integer
      experience_level: experienceLevel || null, // Send null if empty
      skills: skills ? skills.split(',').map(s => s.trim()) : [], // Split comma-separated skills
    };

    try {
      // Make the POST request to the backend to start the interview
      const response = await api.post('/start_interview', setupData);

      // If successful, call the prop function to transition to the interview page
      onStartInterview(response.data);

    } catch (err) {
      console.error("Error starting interview:", err);
      setError("Failed to start interview. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="setup-page">
      <h2>Setup Your Interview</h2>
      <form onSubmit={handleSubmit} className="setup-form">
        <div className="form-group">
          <label htmlFor="jobField">Job Field:</label>
          <input
            id="jobField"
            type="text"
            value={jobField}
            onChange={(e) => setJobField(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="numQuestions">Number of Questions:</label>
          <input
            id="numQuestions"
            type="number"
            value={numQuestions}
            onChange={(e) => setNumQuestions(e.target.value)}
            min="1" // Ensure at least 1 question
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="experienceLevel">Experience Level (Optional):</label>
          <input
            id="experienceLevel"
            type="text"
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="skills">Key Skills (Comma-separated, Optional):</label>
          <input
            id="skills"
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="e.g., Python, Data Analysis, Communication"
          />
        </div>

        <button type="submit" disabled={isLoading} className="start-button">
          {isLoading ? "Starting..." : "Start Interview"}
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default SetupPage;