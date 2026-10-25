const chatContainer = document.getElementById('chat');
const form = document.getElementById('chat-form');
const messageInput = document.getElementById('message');

function appendMessage(role, text = '') {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', role);
    msgDiv.textContent = text;
    chatContainer.appendChild(msgDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    return msgDiv;
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userMessage = messageInput.value.trim();
    if (!userMessage) return;

    // Display user's question
    appendMessage('user', userMessage);
    messageInput.value = '';
    messageInput.focus();

    // Create container for incoming streaming answer
    const assistantMsg = appendMessage('assistant', '');

    try {
        const response = await fetch('http://localhost:8000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userMessage }),
        });

        if (!response.ok) {
            const err = await response.text();
            assistantMsg.textContent = `Error: ${err || response.statusText}`;
            return;
        }

        // Stream real-time tokens from FastAPI backend
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            assistantMsg.textContent += chunk;
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    } catch (err) {
        assistantMsg.textContent = `[Connection Error]: ${err.message}`;
    }
});
