# AI Interview Coach

This project is an AI-powered mock interview simulation application. It features a frontend built with React and Vite, and a backend powered by FastAPI in Python. Users can configure interview parameters based on their needs and receive AI-driven analysis of their performance at the end of the interview.

## Project Overview

The application guides the user through a simulated interview experience.

1.  **Setup:** The user provides details such as their desired job field, the number of questions they want to be asked, their experience level, and specific skills to focus on.
2.  **Interview:** The AI (simulated in the current version) asks questions one by one in a chatbot interface. The user responds to each question.
3.  **Analysis:** After all questions are answered, the application presents an analysis page with AI feedback on each answer and overall insights into the user's performance.

## Features

*   Configurable interview sessions (job field, number of questions, etc.).
*   Interactive chatbot interview interface.
*   Storage of the complete question and answer transcript for each session.
*   AI-powered analysis of the interview performance (currently simulated with placeholder logic).
*   Results page displaying detailed feedback per question and overall.
*   Backend built with FastAPI for API handling.
*   Frontend built with React and Vite for a dynamic user interface.
*   Configuration management using environment variables (`.env`).

## Tech Stack

*   **Frontend:** React, Vite
*   **Backend:** Python, FastAPI
*   **AI/NLP:** Planned integration with Large Language Models (LLMs) via API (currently simulated)
*   **Data Storage:** In-memory dictionary (for demonstration, placeholder for a persistent database)
*   **Configuration:** `python-dotenv`, Pydantic

## Future Work

The following features are planned to enhance the application:

*   Full implementation of `interview_manager.py`, `ai_service.py`, and `data_manager.py`.
*   Integration with an actual LLM API for question generation and sophisticated answer analysis.
*   Implement persistent data storage (e.g., using SQLAlchemy and a database) instead of in-memory storage.
*   Develop more detailed and structured AI analysis feedback.
*   Improve the user interface and user experience.
*   Add error handling and validation on both frontend and backend.
*   Explore different interview types or formats.
