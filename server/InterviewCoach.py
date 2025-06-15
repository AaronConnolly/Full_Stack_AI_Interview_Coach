import google.generativeai as genai
from utils import get_api_key
from response_templates import RESPONSE_TEMPLATES

class AIInterviewCoach:
    def __init__(self):
        genai.configure(api_key=get_api_key()) # Use the function from utils
        self.model = genai.GenerativeModel("models/gemini-1.5-flash-latest")
        # ... rest of the class ...

    def generate_questions(self, job_role, num_questions=1):
        prompt = f"""Generate {num_questions} insightful interview questions for a candidate applying 
                     for a {job_role} role. {RESPONSE_TEMPLATES['generate_question'][0]}"""
        try:
            response = self.model.generate_content(prompt)
            questions = response.text.strip().split('\n')
            return questions[:num_questions] #Return only the requested number of questions
        except Exception as e:
            return [f"Error generating questions: {e}"]

    def answer_question(self, question, answer):
        prompt = f"""Evaluate the following candidate answer to an interview question. The question was: 
        "{question}". The answer is: "{answer}". {RESPONSE_TEMPLATES['answer_question'][0]}"""
        try:
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            return f"Error evaluating answer: {e}"