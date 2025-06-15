RESPONSE_TEMPLATES = {
    "analyse_question": [
        """
        Provide constructive feedback on the answer, focusing on strengths and weaknesses, and suggest 
        improvements. Consider the answer's clarity, completeness, and demonstration of relevant skills for the 
        role. this response should be short and concise so that the use will receive valuable information.
        Keep the response very short
        """
    ],
    "generate_question": [
        """
        The questions should assess problem-solving abilities, communication skills, and relevant 
        technical knowledge. your question should be relative size to an actual in-person interview and not have 
        too much information or too many parts
        Keep the question really short
        """
    ],
    "overall_feedback": [
        """
        Provide a concise summary of the candidate's performance, highlighting key strengths and areas for 
        improvement. Focus on the candidate's ability to communicate effectively, demonstrate relevant skills, 
        and fit for the role. Keep the feedback short and actionable.
        """
    ],
}
