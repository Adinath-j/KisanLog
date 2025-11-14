// ✅ Check if user is logged in before opening chatbot
function toggleChat() {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    
    // Redirect to login if not logged in
    if (!user || !user.isLoggedIn) {
        window.location.href = "/login.html";
        return;
    }
    
    // Toggle chat if logged in
    const chatWindow = document.getElementById('chatbot-window');
    chatWindow.style.display = chatWindow.style.display === "flex" ? "none" : "flex";
}

async function sendMessage() {
    const input = document.getElementById("chatbot-input");
    const message = input.value;
    if (!message) return;

    addMessage(message, "user");

    // Get user data from localStorage
    const user = JSON.parse(localStorage.getItem("loggedInUser")) || {};
    
    // Generate the correct key format: farmData_{email}_expenses
    const email = user.email ? encodeURIComponent(user.email.toLowerCase()) : "";
    const expensesKey = `farmData_${email}_expenses`;
    const yieldsKey = `farmData_${email}_yields`;
    
    const expenses = JSON.parse(localStorage.getItem(expensesKey) || "[]");
    const yields = JSON.parse(localStorage.getItem(yieldsKey) || "[]");
    
    // Debug: Log what we're retrieving
    console.log("User Email:", user.email);
    console.log("Expenses Key:", expensesKey);
    console.log("Yields Key:", yieldsKey);
    console.log("Expenses Data:", expenses);
    console.log("Yields Data:", yields);
    console.log("All localStorage keys:", Object.keys(localStorage));

    try {
        const response = await fetch("/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                message: message,
                userData: user,
                expensesData: expenses,
                yieldsData: yields
            })
        });

        const data = await response.json();
        addMessage(data.reply, "bot");
    } catch (error) {
        addMessage("Error connecting to chatbot. Please try again.", "bot");
        console.error("Chat error:", error);
    }

    input.value = "";
}

function addMessage(text, sender) {
    const msgBox = document.getElementById("chatbot-messages");
    const div = document.createElement("div");

    div.className = sender === "user" ? "message-user" : "message-bot";
    div.textContent = text;

    msgBox.appendChild(div);
    msgBox.scrollTop = msgBox.scrollHeight;
}
