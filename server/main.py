import uvicorn
import uuid
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any # Import Dict and Any for flexible data structures
from InterviewCoach import AIInterviewCoach

coach = AIInterviewCoach()

# --- Pydantic Models ---

# Model for the initial interview setup data received from the frontend
class InterviewSetup(BaseModel):
    job_field: str
    num_questions: int
    experience_level: Optional[str] = None # Optional field
    skills: Optional[List[str]] = None      # Optional list of strings

# Model for the user's answer submitted during the interview
class UserAnswer(BaseModel):
    session_id: str       # Needed to identify the ongoing interview
    answer_text: str

# Model for returning the AI's question to the frontend
class AIQuestion(BaseModel):
    session_id: str
    question_text: str
    question_index: int # Useful for frontend to display progress (e.g., 1/10)
    is_complete: bool = False # Flag to indicate if the interview is finished

# Model for representing a question-answer pair in the transcript
class QandA(BaseModel):
    question: str
    answer: str

# Model for the structure of stored session data (in our simple memory_db)
class InterviewSessionData(BaseModel):
    setup: InterviewSetup
    transcript: List[QandA] = []
    current_question_index: int = 0
    questions_list: List[str] = [] # The full list of questions planned for this interview
    analysis_results: Optional[Dict[str, Any]] = None # To store results later
    status: str = "active" # e.g., "active", "complete", "analysis_pending"


# --- FastAPI App Setup ---

app = FastAPI(debug=True)

# Configure CORS (Adjust origins as needed for your frontend)
origins = [
    "http://localhost:5173",
    # Add other frontend origins here (e.g., production domain)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"], # Allows all headers
)

# --- Simple In-Memory Database (for demonstration) ---
# In a real application, you would use a proper database (like PostgreSQL, MongoDB, etc.)
# and manage data access via a data_manager.py file as discussed previously.
memory_db: Dict[str, InterviewSessionData] = {}


# --- Placeholder for AI/Interview Management Logic ---
# These functions simulate the behavior of your interview_manager.py and ai_service.py
# You will replace these calls with actual calls to your separate modules later.

def _generate_initial_questions(setup: InterviewSetup) -> List[str]:
    """Simulates generating a list of questions based on setup."""
    # In your actual ai_service.py or interview_manager.py:
    # - This would likely call the AI model or select from a question bank
    # - It should generate exactly setup.num_questions questions
    print(f"Question generation for: {setup}")
    questions = []
    for i in range(setup.num_questions):
        question = coach.generate_question(setup.job_field)
        questions.append(question)

    return questions

def _trigger_analysis(session_data: InterviewSessionData) -> Dict[str, Any]:
    """Simulates triggering the AI analysis process."""
    # In your actual ai_service.py:
    # - This would send the transcript and setup to the AI model for analysis
    # - It should return a structured dictionary of results
    print(f"Analysis for session: {list(memory_db.keys())[list(memory_db.values()).index(session_data)]}")
    print("Transcript:", session_data.transcript)
    dummy_analysis = {
        "overall_feedback": coach.overrall_feedback(session_data.transcript),
        "question_feedback": []
    }
    for i, qa in enumerate(session_data.transcript):
         dummy_analysis["question_feedback"].append({
             "question": qa.question,
             "user_answer": qa.answer,
             "ai_feedback": coach.analyse_question(qa.question, qa.answer)
         })
    return dummy_analysis


# --- API Endpoints ---

@app.post("/start_interview", response_model=AIQuestion)
def start_interview(setup: InterviewSetup):
    """
    Receives user setup data and starts a new interview session.
    Returns the first question.
    """
    session_id = str(uuid.uuid4()) # Generate a unique ID

    # --- Simulate Interview Manager Logic: Create Session ---
    questions_list = _generate_initial_questions(setup)
    if not questions_list:
        raise HTTPException(status_code=500, detail="Failed to generate questions.")

    session_data = InterviewSessionData(
        setup=setup,
        questions_list=questions_list,
        current_question_index=0
    )
    memory_db[session_id] = session_data # Store the new session

    # Get the first question
    first_question_text = session_data.questions_list[0]

    # Return the first question details
    return AIQuestion(
        session_id=session_id,
        question_text=first_question_text,
        question_index=0,
        is_complete=False # Interview is not complete yet
    )


@app.post("/submit_answer")
def submit_answer(user_answer: UserAnswer):
    """
    Receives a user's answer for a given session, stores it,
    and returns the next question or a completion signal.
    """
    session_id = user_answer.session_id
    answer_text = user_answer.answer_text

    # --- Simulate Interview Manager Logic: Process Answer ---
    session_data = memory_db.get(session_id)
    if not session_data:
        raise HTTPException(status_code=404, detail="Interview session not found.")

    if session_data.status == "complete":
         raise HTTPException(status_code=400, detail="Interview is already complete.")


    # Ensure we don't go out of bounds if somehow multiple answers arrive for the last question
    if session_data.current_question_index >= len(session_data.questions_list):
        session_data.status = "complete"
        # Optionally trigger analysis here if it wasn't already
        if not session_data.analysis_results:
             session_data.analysis_results = _trigger_analysis(session_data)
        return {"status": "interview_complete", "session_id": session_id}


    # Get the current question text before incrementing the index
    current_question_text = session_data.questions_list[session_data.current_question_index]

    # Save the question and answer pair
    session_data.transcript.append(QandA(question=current_question_text, answer=answer_text))

    # Increment the question index for the next question
    session_data.current_question_index += 1

    # Check if the interview is complete
    is_interview_complete = session_data.current_question_index >= len(session_data.questions_list)

    if is_interview_complete:
        session_data.status = "analysis_pending" # Or "complete"

        # --- Simulate Interview Manager Logic: End Interview & Trigger Analysis ---
        session_data.analysis_results = _trigger_analysis(session_data)
        session_data.status = "complete"


        # Return completion signal
        return {"status": "interview_complete", "session_id": session_id}
    else:
        # Get the next question text
        next_question_text = session_data.questions_list[session_data.current_question_index]

        # Return the next question details
        return AIQuestion(
            session_id=session_id,
            question_text=next_question_text,
            question_index=session_data.current_question_index,
            is_complete=False
        )


@app.get("/results/{session_id}")
def get_results(session_id: str):
    """
    Retrieves the AI analysis results for a completed interview session.
    """
    session_data = memory_db.get(session_id)
    if not session_data:
        raise HTTPException(status_code=404, detail="Interview session not found.")

    if session_data.status != "complete" or not session_data.analysis_results:
         raise HTTPException(status_code=400, detail="Interview not yet complete or analysis pending.")

    # Return the analysis results
    return session_data.analysis_results # dictionary


# --- Run the application ---

if __name__ == "__main__":
    # To run: uvicorn main:app --reload
    uvicorn.run(app, host="0.0.0.0", port=8000)
