let isOpen = false;


// Auto-resize textarea
const chatInput = document.getElementById('chatInput');
if (chatInput) {
    chatInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });
}


// Toggle chat widget
function toggleChat() {
    const container = document.getElementById('chatContainer');
    const toggle = document.getElementById('chatToggle');
    const icon = document.getElementById('toggleIcon');
   
    isOpen = !isOpen;
   
    if (isOpen) {
        container.classList.add('open');
        toggle.classList.add('active');
        // Replace logo with close icon
        icon.outerHTML = '<span id="toggleIcon" style="font-size: 24px; color: #2D1B69;">✕</span>';
    } else {
        container.classList.remove('open');
        toggle.classList.remove('active');
        // Replace close icon with logo
        const currentIcon = document.getElementById('toggleIcon');
        currentIcon.outerHTML = '<img class="logo-img" id="toggleIcon" src="https://res.cloudinary.com/deyzbqzya/image/upload/v1750009661/Blue_Pri0r1ty_Icon_fsmbrw.png" alt="Priority Logo">';
    }
}


// Form validation
function validateForm() {
    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const gdprConsent = document.getElementById('gdprConsent').checked;
   
    const startBtn = document.getElementById('startChatBtn');
    startBtn.disabled = !(name && email && gdprConsent);
}


// Add event listeners for real-time validation
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('userName').addEventListener('input', validateForm);
    document.getElementById('userEmail').addEventListener('input', validateForm);
    document.getElementById('gdprConsent').addEventListener('change', validateForm);


    // Initialize validation
    validateForm();
});


function startChat() {
    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const gdprConsent = document.getElementById('gdprConsent').checked;


    if (!name || !email || !gdprConsent) {
        alert('Please fill in all required fields and accept the privacy policy.');
        return;
    }


    // Store user data (in a real app, this would be sent to your backend)
    const userData = {
        name,
        email,
        gdprConsent,
        timestamp: new Date().toISOString()
    };


    console.log('User data collected:', userData);


    // TODO: Send userData to your webhook endpoint
    // Example:
    // fetch('/api/chatbot/register', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(userData)
    // });


    // Transition to chat interface
    document.getElementById('gdprForm').style.display = 'none';
    document.getElementById('chatInterface').style.display = 'flex';


    // Personalize welcome message
    const welcomeMessage = document.querySelector('.welcome-message h4');
    welcomeMessage.textContent = `👋 Welcome, ${name.split(' ')[0]}!`;
}


function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
   
    if (!message) return;


    // Add user message to chat (placeholder for now)
    console.log('Sending message:', message);


    // TODO: Send message to your webhook endpoint
    // Example:
    // fetch('/api/chatbot/message', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ message, timestamp: new Date().toISOString() })
    // });
   
    // Clear input
    input.value = '';
    input.style.height = 'auto';
   
    // Here you would typically handle the bot response
    // and add both user and bot messages to the chat
}


function sendQuickMessage(message) {
    console.log('Quick message:', message);
   
    // TODO: Handle quick action messages
    // You can call sendMessage() or handle these differently
    // For example, set the input value and send automatically:
    // document.getElementById('chatInput').value = message;
    // sendMessage();
}


function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

