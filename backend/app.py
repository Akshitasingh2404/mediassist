from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
from groq import Groq

load_dotenv()

app = Flask(__name__)
CORS(app)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

SYSTEM_PROMPT = """You are MediAssist, a helpful AI healthcare assistant.
Provide general health information and wellness guidance only.
Always recommend consulting a real doctor for medical decisions.
Never diagnose with certainty. Be empathetic and clear."""

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "")
    history = data.get("history", [])

    messages = [{"role": "system", "content": SYSTEM_PROMPT}] + history + [
        {"role": "user", "content": user_message}
    ]

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        max_tokens=500
    )

    return jsonify({"reply": response.choices[0].message.content})

if __name__ == "__main__":
    app.run(debug=True, port=5000)