document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const chatToggle = document.getElementById('chat-toggle');
  const chatWindow = document.getElementById('chat-window');
  const closeChat = document.getElementById('close-chat');
  const chatMessages = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const sendMessage = document.getElementById('send-message');
  const userInfoForm = document.getElementById('user-info-form');
  const userNameInput = document.getElementById('user-name');
  const userEmailInput = document.getElementById('user-email');
  const startChatBtn = document.getElementById('start-chat');
  const chatInputArea = document.getElementById('chat-input-area');
  
  // User info
  let userName = '';
  let userEmail = '';
  let chatSession = '';
  let gdprConsent = false;
  
  // Webhook URL - Replace with your actual webhook URL
  const WEBHOOK_URL = 'https://your-webhook-url.com/api/chat';
  
  // Toggle chat window
  chatToggle.addEventListener('click', function() {
    if (chatWindow.style.display === 'none' || chatWindow.style.display === '') {
      chatWindow.style.display = 'flex';
      chatToggle.style.display = 'none';
    }
  });
  
  // Close chat window
  closeChat.addEventListener('click', function() {
    chatWindow.style.display = 'none';
    chatToggle.style.display = 'block';
  });
  
  // Start chat after user enters info
  startChatBtn.addEventListener('click', function() {
    userName = userNameInput.value.trim();
    userEmail = userEmailInput.value.trim();
    gdprConsent = document.getElementById('gdpr-consent').checked;
    
    if (!userName || !userEmail) {
      alert('Please enter both your name and email to start the chat.');
      return;
    }
    
    if (!validateEmail(userEmail)) {
      alert('Please enter a valid email address.');
      return;
    }
    
    if (!gdprConsent) {
      alert('Please provide GDPR consent to continue.');
      return;
    }
    
    // Generate a session ID
    chatSession = 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2);
    
    // Hide the form and show the chat interface
    userInfoForm.style.display = 'none';
    chatInputArea.style.display = 'flex';
    
    // Add welcome message
    addBotMessage(`Hello ${userName}! How can I help you today?`);
  });
  
  // Send message on button click
  sendMessage.addEventListener('click', sendUserMessage);
  
  // Send message on Enter key
  chatInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      sendUserMessage();
    }
  });
  
  // Send user message to webhook
  function sendUserMessage() {
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    // Add user message to chat
    addUserMessage(message);
    
    // Clear input
    chatInput.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Send to webhook
    fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        userName: userName,
        userEmail: userEmail,
        sessionId: chatSession,
        gdprConsent: gdprConsent,
        timestamp: new Date().toISOString()
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Hide typing indicator
      hideTypingIndicator();
      
      // Add bot response to chat
      addBotMessage(data.message || 'Sorry, I couldn\'t process your request.');
    })
    .catch(error => {
      // Hide typing indicator
      hideTypingIndicator();
      
      console.error('Error:', error);
      addBotMessage('Sorry, I encountered an error. Please try again later.');
    });
  }
  
  // Add user message to chat
  function addUserMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', 'user-message');
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
  }
  
  // Add bot message to chat
  function addBotMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', 'bot-message');
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
  }
  
  // Show typing indicator
  function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.classList.add('typing-indicator');
    typingDiv.innerHTML = '<span></span><span></span><span></span>';
    chatMessages.appendChild(typingDiv);
    scrollToBottom();
  }
  
  // Hide typing indicator
  function hideTypingIndicator() {
    const typingDiv = document.getElementById('typing-indicator');
    if (typingDiv) {
      typingDiv.remove();
    }
  }
  
  // Scroll to bottom of chat
  function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  
  // Validate email
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
});