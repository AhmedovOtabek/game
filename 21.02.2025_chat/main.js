const messagesDiv = document.getElementById("messages");
const input = document.querySelector(".writer");
const sendButton = document.querySelector(".send-m");
let lastMessageCount = 0;
const user = window.location.pathname.includes("index2.html") ? "user2" : "user1";
let isFetching = false;
let isSending = false; 

function fetchMessages() {
    if (isFetching) return;
    isFetching = true;

    fetch("http://localhost:3000/messages")
        .then(response => response.json())
        .then(messages => {
            messagesDiv.innerHTML = "";
            messages.forEach(msg => {
                const messageElement = document.createElement("p");
                messageElement.textContent = `${msg.sender}: ${msg.text}`;
                messageElement.classList.add(msg.sender === user ? "right" : "left");
                messagesDiv.appendChild(messageElement);
            });

            lastMessageCount = messages.length;
        })
        .catch(error => console.error("Xabarlarni yuklashda xatolik:", error))
        .finally(() => isFetching = false);
}

function sendMessage() {
    const text = input.value.trim();
    if (!text || isSending) return;
    
    isSending = true; // Xabar ketayotganini bildiradi

    const message = { sender: user, text,};

    fetch("http://localhost:3000/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message),
    })
    .then(() => {
        input.value = "";
        fetchMessages();
    })
    .catch(error => console.error("Xabar yuborishda xatolik:", error))
    .finally(() => isSending = false);
}

sendButton.addEventListener("click", sendMessage);
input.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        sendMessage();
    }
});


setInterval(fetchMessages, 3000);
fetchMessages();
clearButton.addEventListener("click", clearMessages); 
