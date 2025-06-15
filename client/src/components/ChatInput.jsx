import React, { useState } from 'react';

// Props:
// - onSubmitAnswer: function to call when the user submits an answer. It takes the answer text as an argument.
// - isLoading: boolean, true if the app is waiting for the backend (e.g., for the next question). Disable input/button.

const ChatInput = ({ onSubmitAnswer, isLoading }) => {
  const [answerText, setAnswerText] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (answerText && !isLoading) {
      onSubmitAnswer(answerText);
      setAnswerText(''); // Clear the input field after submitting
    }
  };

  return (
    <form onSubmit={handleSubmit} className="chat-input-form">
      <input
        type="text"
        value={answerText}
        onChange={(e) => setAnswerText(e.target.value)}
        placeholder={isLoading ? "Waiting for next question..." : "Type your answer here..."}
        disabled={isLoading} // Disable input when loading
        className="chat-input"
      />
      <button type="submit" disabled={!answerText || isLoading} className="send-button">
        {isLoading ? "Sending..." : "Send Answer"}
      </button>
    </form>
  );
};

export default ChatInput;
