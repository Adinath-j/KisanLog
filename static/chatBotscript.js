function toggleChat() {
    const chatWindow = document.getElementById('chatbot-window');
    chatWindow.style.display = chatWindow.style.display === "flex" ? "none" : "flex";
}

async function sendMessage() {
    const input = document.getElementById("chatbot-input");
    const message = input.value;
    if (!message) return;

    addMessage(message, "user");

    const response = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
    });

    const data = await response.json();
    addMessage(data.reply, "bot");

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
