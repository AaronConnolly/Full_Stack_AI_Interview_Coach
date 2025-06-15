import React, { useState, useEffect } from 'react';
import api from '../api';

// Props:
// - session_id: The ID of the completed interview session
// - onRestart: Function to call to go back to the setup page

const ResultsPage = ({ session_id, onRestart }) => {
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Make the GET request to the backend to get the analysis results
        const response = await api.get(`/results/${session_id}`);
        setAnalysisResults(response.data); // Store the received analysis data
      } catch (err) {
        console.error("Error fetching analysis results:", err);
        setError("Failed to load analysis results.");
      } finally {
        setIsLoading(false);
      }
    };

    if (session_id) {
      fetchResults();
    } else {
      setError("No session ID provided for results.");
      setIsLoading(false);
    }

  }, [session_id]); // Effect runs when session_id changes (i.e., when this page is shown)

  if (isLoading) {
    return <div className="results-page">Loading analysis...</div>;
  }

  if (error) {
    return (
        <div className="results-page">
            <p className="error-message">{error}</p>
            <button onClick={onRestart}>Start a New Interview</button>
        </div>
    );
  }

  if (!analysisResults) {
      return (
          <div className="results-page">
              <p>No analysis results found for this session.</p>
              <button onClick={onRestart}>Start a New Interview</button>
          </div>
      );
  }


  return (
    <div className="results-page">
      <h2>Interview Analysis Results</h2>

      <div className="overall-feedback">
        <h3>Overall Feedback</h3>
        <p>{analysisResults.overall_feedback}</p>
      </div>

      <div className="question-by-question-feedback">
        <h3>Question Breakdown</h3>
        {analysisResults.question_feedback && analysisResults.question_feedback.map((feedback, index) => (
          <div key={`q-feedback-${index}`} className="question-feedback-item">
            <h4>Question {index + 1}: {feedback.question}</h4>
            <p><strong>Your Answer:</strong> {feedback.user_answer}</p>
            <p><strong>AI Feedback:</strong> {feedback.ai_feedback}</p>
          </div>
        ))}
      </div>

      <button onClick={onRestart} className="restart-button">Start a New Interview</button>
    </div>
  );
};

export default ResultsPage;
