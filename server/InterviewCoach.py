import google.generativeai as genai
from utils import get_api_key
from response_templates import RESPONSE_TEMPLATES

class AIInterviewCoach:
    def __init__(self):
        genai.configure(api_key=get_api_key()) # Use the function from utils
        self.model = genai.GenerativeModel("models/gemini-1.5-flash-latest")
        # ... rest of the class ...

    def generate_question(self, job_role):
        prompt = f"""Generate an insightful interview question for a candidate applying 
                     for a {job_role} role. {RESPONSE_TEMPLATES['generate_question'][0]}"""
        try:
            response = self.model.generate_content(prompt)
            question = response.text.strip() if response and hasattr(response, "text") else None
            if question:
                return question
            else:
                return "No question generated."
        except Exception as e:
            return f"Error generating question: {e}"


    def analyse_question(self, question, answer):
        prompt = f"""Evaluate the following candidate answer to an interview question. The question was: 
        "{question}". The answer is: "{answer}". {RESPONSE_TEMPLATES['analyse_question'][0]}"""
        try:
            response = self.model.generate_content(prompt)
            print(f"Generated response: {response.text.strip()}")
            return response.text.strip()
        except Exception as e:
            return f"Error evaluating answer: {e}"

    def overrall_feedback(self, session_data):
        prompt = f"""Provide overall feedback on the interview session. The session data is: {session_data}. 
        {RESPONSE_TEMPLATES['overall_feedback'][0]}"""
        try:
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            return f"Error generating overall feedback: {e}"