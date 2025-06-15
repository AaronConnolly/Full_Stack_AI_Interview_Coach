import React, { useState, useEffect } from 'react';
import api from '../api';
import ConversationHistory from './ConversationHistory';
import ChatInput from './ChatInput';

// Props:
// - initialData: The data received from the backend when starting the interview
//   ({ session_id, question_text, question_index, is_complete })
// - onInterviewComplete: Function to call when the interview finishes, passing the session_id
//   This tells the App component to switch to the ResultsPage.

const InterviewPage = ({ initialData, onInterviewComplete }) => {
  const [sessionData, setSessionData] = useState({
    session_id: initialData.session_id,
    current_question: initialData.question_text,
    current_question_index: initialData.question_index,
    transcript: [], // Starts empty, will be populated as user answers
    isLoadingNextQuestion: false,
    error: null,
  });

  // Function to handle user submitting an answer
  const handleSubmitAnswer = async (answerText) => {
    setSessionData(prev => ({ ...prev, isLoadingNextQuestion: true, error: null }));

    const answerData = {
      session_id: sessionData.session_id,
      answer_text: answerText,
    };

    try {
      // Make the POST request to the backend to submit the answer
      const response = await api.post('/submit_answer', answerData);

      // Update the transcript with the submitted Q&A
      setSessionData(prev => ({
        ...prev,
        transcript: [...prev.transcript, { question: prev.current_question, answer: answerText }],
      }));

      // Check the backend's response to see if the interview is complete
      if (response.data.status === "interview_complete") {
        // Call the prop function to switch to the results page
        onInterviewComplete(sessionData.session_id);
      } else {
        // Update state with the next question from the backend
        setSessionData(prev => ({
          ...prev,
          current_question: response.data.question_text,
          current_question_index: response.data.question_index,
          isLoadingNextQuestion: false, // Finished loading the next question
        }));
      }

    } catch (err) {
      console.error("Error submitting answer:", err);
      setSessionData(prev => ({
        ...prev,
        error: "Failed to submit answer or get next question. Please try refreshing.",
        isLoadingNextQuestion: false, // Stop loading
      }));
      // Handle error in UI, maybe allow retry or go back to setup
    }
  };

  return (
    <div className="interview-page">
      <h2>Mock Interview</h2>
      {sessionData.error && <p className="error-message">{sessionData.error}</p>}
      <ConversationHistory
        transcript={sessionData.transcript}
        currentQuestion={sessionData.current_question}
        isLoading={sessionData.isLoadingNextQuestion}
      />
      <ChatInput
        onSubmitAnswer={handleSubmitAnswer}
        isLoading={sessionData.isLoadingNextQuestion}
      />
    </div>
  );
};

export default InterviewPage;