RESPONSE_TEMPLATES = {
    "answer_question": [
        """Provide constructive feedback on the answer, focusing on strengths and weaknesses, and suggest 
        improvements. Consider the answer's clarity, completeness, and demonstration of relevant skills for the 
        role. this response should be short and concise so that the use will receive valuable information.
        Give the response in html format so that it can be displayed in a web application.
        Use the following format example:
        <h3>Strengths</h3>
        <p>The answer directly addresses the understanding of the question</p>

        <h3>Weaknesses</h3>
        <ul>
        <li></li>
        <li></li>
        </ul>

        <h3>Improvements</h3>
        <ul>
        <li></li>
        <li></li>  
        </ul>

        <p></p>
        """
    ],
    "generate_question": [
        "The questions should assess problem-solving abilities, communication skills, and relevant "
        "technical knowledge. your question should be relative size to an actual in-person interview and not have "
        "too much information or too many parts"
    ]
}
