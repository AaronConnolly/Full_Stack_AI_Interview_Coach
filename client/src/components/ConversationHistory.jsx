import React, { useRef, useEffect } from 'react';

// Props:
// - transcript: List of QandA objects (each { question: string, answer: string }).
// - currentQuestion: string, the question currently being asked (not yet answered).
// - isLoading: boolean, true if the app is waiting for the next question.

const ConversationHistory = ({ transcript, currentQuestion, isLoading }) => {
  const conversationEndRef = useRef(null); // Ref for auto-scrolling

  // Effect to scroll to the bottom when new messages arrive
  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript, currentQuestion]); // Scroll when transcript or current question updates

  return (
    <div className="conversation-history">
      <ul className="message-list">
        {transcript.map((qa, index) => (
          <li key={`qa-${index}`} className="message-item">
            <div className="question-message">
              <strong>AI (Q{index + 1}):</strong> {qa.question}
            </div>
            <div className="answer-message">
              <strong>Your Answer:</strong> {qa.answer}
            </div>
          </li>
        ))}
        {/* Display the current question being asked */}
        {currentQuestion && (
          <li className="message-item">
             <div className="question-message">
                <strong>AI (Q{transcript.length + 1}):</strong> {currentQuestion}
             </div>
          </li>
        )}
         {/* Loading indicator */}
         {isLoading && (
             <li className="message-item loading-indicator">
                 AI is thinking...
             </li>
         )}
        {/* Element to scroll into view */}
        <div ref={conversationEndRef} />
      </ul>
    </div>
  );
};

export default ConversationHistory;
// --- END OF FILE src/components/ConversationHistory.jsx ---