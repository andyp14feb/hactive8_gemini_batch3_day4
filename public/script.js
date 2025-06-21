const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  input.value = '';

  // Simulasi dummy balasan bot (placeholder)
  // setTimeout(() => {
  //   appendMessage('bot', 'Gemini is thinking... (this is dummy response)');
  // }, 1000);

  // Show a "thinking" message from the bot while waiting for the response
  const thinkingMessageElement = appendMessage('bot', 'Gemini is thinking...');

  // Send the user message to the backend
  fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: userMessage }),
  })
  // .then(response => response.json())
  .then(response => {
    if (!response.ok) {
      throw new Error(`Network response was not ok, status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    thinkingMessageElement.remove(); // Remove the "thinking" message
    appendMessage('bot', data.response); // Append the actual bot response
  })
  .catch(error => {
    console.error('Error:', error);
    thinkingMessageElement.remove(); // Also remove the "thinking" message on error
    appendMessage('bot', 'Oops! Something went wrong. Please try again.'); // Display an error message
  });




});

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg;
}
