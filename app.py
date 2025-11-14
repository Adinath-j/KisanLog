from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
import google.generativeai as genai
import os
import json

app = Flask(__name__, static_folder='static', static_url_path='/static')
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
        "Give short, practical answers. Use the user's farm data to provide personalized advice."
    )
)

# Serve main pages from root
@app.route("/")
def land():
    return send_from_directory('.', 'land.html')

@app.route("/login.html")
def login():
    return send_from_directory('.', 'login.html')

@app.route("/register.html")
def register():
    return send_from_directory('.', 'register.html')

# Serve dashboard pages
@app.route("/dashboard/<path:filename>")
def dashboard(filename):
    return send_from_directory('dashboard', filename)

# Serve assets
@app.route("/assets/<path:filename>")
def assets(filename):
    return send_from_directory('assets', filename)

# Chatbot API endpoint with localStorage context
@app.route("/chat", methods=["POST"])
def chat():
    user_msg = request.json.get("message", "")
    
    # Get user data from request (sent from frontend localStorage)
    user_data = request.json.get("userData", {})
    expenses_data = request.json.get("expensesData", [])
    yields_data = request.json.get("yieldsData", [])
    
    # Calculate totals safely
    total_expenses = 0
    try:
        total_expenses = sum([float(e.get('amount', 0)) for e in expenses_data if e.get('amount')])
    except:
        total_expenses = 0
    
    total_revenue = 0
    try:
        total_revenue = sum([float(y.get('totalRevenue', 0)) for y in yields_data if y.get('totalRevenue')])
    except:
        total_revenue = 0
    
    net_profit = total_revenue - total_expenses
    
    # Build context from user's localStorage data
    context = f"""You are analyzing farm data for {user_data.get('fullName', 'a Farmer')} from {user_data.get('location', 'Unknown location')}.

FARM FINANCIAL SUMMARY:
- Total Expenses: ₹{total_expenses:,.2f}
- Total Revenue: ₹{total_revenue:,.2f}
- Net Profit: ₹{net_profit:,.2f}
- Number of Yield Records: {len(yields_data)}
- Number of Expense Records: {len(expenses_data)}
"""
    
    # Add expense breakdown if available
    if expenses_data:
        context += "\nEXPENSE BREAKDOWN (Recent):\n"
        recent_expenses = expenses_data[-10:] if len(expenses_data) > 10 else expenses_data
        expense_by_crop = {}
        expense_by_category = {}
        
        for exp in recent_expenses:
            crop = exp.get('crop', 'Unknown')
            category = exp.get('category', 'Other')
            amount = float(exp.get('amount', 0))
            
            if crop not in expense_by_crop:
                expense_by_crop[crop] = 0
            expense_by_crop[crop] += amount
            
            if category not in expense_by_category:
                expense_by_category[category] = 0
            expense_by_category[category] += amount
        
        context += "By Crop: " + ", ".join([f"{crop}: ₹{amt:,.2f}" for crop, amt in expense_by_crop.items()]) + "\n"
        context += "By Category: " + ", ".join([f"{cat}: ₹{amt:,.2f}" for cat, amt in expense_by_category.items()]) + "\n"
    
    # Add yield breakdown if available
    if yields_data:
        context += "\nYIELD BREAKDOWN (Recent):\n"
        recent_yields = yields_data[-10:] if len(yields_data) > 10 else yields_data
        for yld in recent_yields:
            crop = yld.get('crop', 'Unknown')
            qty = yld.get('quantity', 0)
            revenue = yld.get('totalRevenue', 0)
            context += f"- {crop}: {qty} units, Revenue: ₹{revenue:,.2f}\n"
    
    # Add the user's actual question
    context += f"\nBased on this farm data, answer the following question:\n{user_msg}"

    try:
        response = model.generate_content(context)
        bot_reply = response.text
    except Exception as e:
        bot_reply = f"Error connecting to AI: {str(e)}"

    return jsonify({"reply": bot_reply})

if __name__ == "__main__":
    app.run(debug=True)