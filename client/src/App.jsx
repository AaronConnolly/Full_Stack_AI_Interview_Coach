import React, { useState } from 'react';
import './App.css'; // Keep or update your main styles
import SetupPage from './components/SetupPage';
import InterviewPage from './components/InterviewPage';
import ResultsPage from './components/ResultsPage';

const App = () => {
  // State to track the current screen/page
  const [currentPage, setCurrentPage] = useState('setup'); // 'setup', 'interview', 'results'

  // State to hold initial data for the interview page (from /start_interview response)
  const [initialInterviewData, setInitialInterviewData] = useState(null);

  // State to hold the session ID for the results page
  const [resultsSessionId, setResultsSessionId] = useState(null);


  // Function called by SetupPage when interview starts
  const handleStartInterview = (initialDataFromBackend) => {
    setInitialInterviewData(initialDataFromBackend); // Save the initial question data
    setCurrentPage('interview'); // Switch to the interview page
  };

  // Function called by InterviewPage when interview is complete
  const handleInterviewComplete = (sessionId) => {
    setResultsSessionId(sessionId); // Save the session ID for fetching results
    setCurrentPage('results'); // Switch to the results page
  };

  // Function called by ResultsPage or other error states to restart
  const handleRestart = () => {
    setCurrentPage('setup'); // Go back to setup
    setInitialInterviewData(null); // Clear previous interview data
    setResultsSessionId(null); // Clear previous results session ID
  };

  // Conditional rendering based on currentPage state
  const renderPage = () => {
    switch (currentPage) {
      case 'setup':
        return <SetupPage onStartInterview={handleStartInterview} />;
      case 'interview':
        // Pass the initial data and the completion handler to InterviewPage
        return (
          <InterviewPage
            initialData={initialInterviewData}
            onInterviewComplete={handleInterviewComplete}
          />
        );
      case 'results':
        // Pass the session ID and the restart handler to ResultsPage
        return <ResultsPage session_id={resultsSessionId} onRestart={handleRestart} />;
      default:
        // Fallback or error page
        return (
          <div>
            <p>Something went wrong. <button onClick={handleRestart}>Restart</button></p>
          </div>
        );
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>AI Interview Coach</h1>
      </header>
      <main>
        {renderPage()} {/* Render the current page component */}
      </main>
      {/* Footer or other persistent elements */}
    </div>
  );
};

export default App;
