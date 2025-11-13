from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import google.generativeai as genai

app = Flask(__name__)
CORS(app)

# Configure Gemini API Key
genai.configure(api_key="AIzaSyBXXogLMWurGCDNREg-kiQrBkit7V3CVgA")

# Load Model with SYSTEM TRAINING
model = genai.GenerativeModel(
    "gemini-2.5-flash",
    system_instruction=(
        "You are a Smart Farm Assistant. "
        "You help farmers with crops, fertilizer suggestions, "
        "weather advice, soil health, pests, crop diseases, "
        "agriculture expenses, and modern farming techniques. "
        "Give short, practical answers."
    )
)

@app.route("/")
def home():
    return render_template("chatBotindex.html")

@app.route("/chat", methods=["POST"])
def chat():
    user_msg = request.json.get("message", "")

    try:
        response = model.generate_content(user_msg)
        bot_reply = response.text
    except Exception as e:
        bot_reply = f"Error: {e}"

    return jsonify({"reply": bot_reply})

if __name__ == "__main__":
    app.run(debug=True)
