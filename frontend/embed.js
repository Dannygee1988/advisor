(function() {
  // Configuration (you can customize this for each client)
  const config = {
    chatbotServerUrl: 'https://your-backend-url.com',
    companyLogo: 'https://your-cdn.com/images/Pri0r1ty_PRIMARY-Logo_Colour-ICON-CMYK.png',
    primaryColor: '#4a85e8',
    headerTitle: 'Chat Support',
    headerSubtitle: 'How can we help you today?'
  };

  // Create and inject CSS
  function injectStyles() {
    const style = document.createElement('style');
    style.innerHTML = `
      /* Base styles */
      #pri0r1ty-chatbot-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 350px;
        z-index: 1000;
        font-family: Arial, sans-serif;
      }

      /* Chat toggle button */
      #pri0r1ty-chat-toggle {
        background-color: ${config.primaryColor};
        color: white;
        border: none;
        border-radius: 50%;
        width: 60px;
        height: 60px;
        font-size: 24px;
        cursor: pointer;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        position: absolute;
        bottom: 0;
        right: 0;
      }

      /* Chat window */
      #pri0r1ty-chat-window {
        display: none;
        background-color: white;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        overflow: hidden;
        height: 500px;
        flex-direction: column;
      }

      /* Chat header */
      #pri0r1ty-chat-header {
        background-color: ${config.primaryColor};
        color: white;
        padding: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
      }

      #pri0r1ty-header-content {
        display: flex;
        width: 100%;
        position: relative;
      }

      #pri0r1ty-logo-container {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        left: 0;
      }

      #pri0r1ty-company-logo {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }

      #pri0r1ty-header-text {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        width: 100%;
        padding: 0 30px;
      }

      #pri0r1ty-header-title {
        font-weight: bold;
        font-size: 16px;
      }

      #pri0r1ty-header-subtitle {
        font-size: 12px;
        opacity: 0.9;
      }

      #pri0r1ty-close-chat {
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        position: absolute;
        right: 15px;
        top: 50%;
        transform: translateY(-50%);
      }

      /* Chat messages area */
      #pri0r1ty-chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 15px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      /* Chat input area */
      #pri0r1ty-chat-input-area {
        padding: 15px 15px 30px 15px;
        background-color: #f5f5f5;
        display: flex;
        gap: 10px;
        border-top: 1px solid #e0e0e0;
        position: relative;
      }

      #pri0r1ty-trademark {
        position: absolute;
        bottom: 5px;
        left: 0;
        right: 0;
        text-align: center;
        font-size: 10px;
        color: #888;
      }

      #pri0r1ty-chat-input {
        flex: 1;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 20px;
        outline: none;
      }

      #pri0r1ty-send-message {
        background-color: ${config.primaryColor};
        color: white;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        cursor: pointer;
        font-size: 16px;
      }

      /* Message styles */
      .pri0r1ty-message {
        max-width: 80%;
        padding: 10px 15px;
        border-radius: 18px;
        word-wrap: break-word;
      }

      .pri0r1ty-bot-message {
        background-color: #f1f1f1;
        align-self: flex-start;
      }

      .pri0r1ty-user-message {
        background-color: #e3f2fd;
        align-self: flex-end;
      }

      /* User info form */
      #pri0r1ty-user-info-form {
        display: flex;
        flex-direction: column;
        gap: 15px;
        padding: 20px;
      }

      .pri0r1ty-consent-group {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        gap: 10px;
      }

      .pri0r1ty-consent-group input[type="checkbox"] {
        margin-top: 3px;
      }

      .pri0r1ty-consent-group label {
        font-size: 12px;
        font-weight: normal;
        line-height: 1.4;
      }

      .pri0r1ty-form-group {
        display: flex;
        flex-direction: column;
        gap: 5px;
      }

      .pri0r1ty-form-group label {
        font-weight: bold;
      }

      .pri0r1ty-form-group input {
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
      }

      #pri0r1ty-start-chat {
        background-color: ${config.primaryColor};
        color: white;
        border: none;
        padding: 10px;
        border-radius: 5px;
        cursor: pointer;
        font-weight: bold;
        width: 140px;
        margin: 0 auto;
      }

      /* Typing indicator */
      .pri0r1ty-typing-indicator {
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 10px 15px;
        background-color: #f1f1f1;
        border-radius: 18px;
        align-self: flex-start;
        width: fit-content;
      }

      .pri0r1ty-typing-indicator span {
        width: 8px;
        height: 8px;
        background-color: #888;
        border-radius: 50%;
        display: inline-block;
        animation: pri0r1ty-typing 1.4s infinite ease-in-out both;
      }

      .pri0r1ty-typing-indicator span:nth-child(1) {
        animation-delay: 0s;
      }

      .pri0r1ty-typing-indicator span:nth-child(2) {
        animation-delay: 0.2s;
      }

      .pri0r1ty-typing-indicator span:nth-child(3) {
        animation-delay: 0.4s;
      }

      @keyframes pri0r1ty-typing {
        0%, 100% {
          transform: scale(0.7);
          opacity: 0.5;
        }
        50% {
          transform: scale(1);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Create and inject HTML
  function injectHTML() {
    const chatbotContainer = document.createElement('div');
    chatbotContainer.id = 'pri0r1ty-chatbot-container';
    
    chatbotContainer.innerHTML = `
      <!-- Chat toggle button -->
      <button id="pri0r1ty-chat-toggle">💬</button>
      
      <!-- Chat window -->
      <div id="pri0r1ty-chat-window">
        <!-- Chat header -->
        <div id="pri0r1ty-chat-header">
          <div id="pri0r1ty-header-content">
            <div id="pri0r1ty-logo-container">
              <img id="pri0r1ty-company-logo" src="${config.companyLogo}" alt="Company Logo">
            </div>
            <div id="pri0r1ty-header-text">
              <span id="pri0r1ty-header-title">${config.headerTitle}</span>
              <span id="pri0r1ty-header-subtitle">${config.headerSubtitle}</span>
            </div>
            <button id="pri0r1ty-close-chat">✕</button>
          </div>
        </div>
        
        <!-- Chat messages area -->
        <div id="pri0r1ty-chat-messages">
          <!-- User info form (initially shown) -->
          <div id="pri0r1ty-user-info-form">
            <div class="pri0r1ty-form-group">
              <label for="pri0r1ty-user-name">Name</label>
              <input type="text" id="pri0r1ty-user-name" placeholder="Enter your name" required>
            </div>
            <div class="pri0r1ty-form-group">
              <label for="pri0r1ty-user-email">Email</label>
              <input type="email" id="pri0r1ty-user-email" placeholder="Enter your email" required>
            </div>
            <div class="pri0r1ty-form-group pri0r1ty-consent-group">
              <input type="checkbox" id="pri0r1ty-gdpr-consent" required>
              <label for="pri0r1ty-gdpr-consent">I consent to the processing of my personal data in accordance with GDPR regulations for the purpose of this chat conversation.</label>
            </div>
            <button id="pri0r1ty-start-chat">Start Chat</button>
          </div>
        </div>
        
        <!-- Chat input area (initially hidden) -->
        <div id="pri0r1ty-chat-input-area" style="display: none;">
          <input type="text" id="pri0r1ty-chat-input" placeholder="Type your message...">
          <button id="pri0r1ty-send-message">→</button>
          <div id="pri0r1ty-trademark">Built by Pri0r1ty AI</div>
        </div>
      </div>
    `;
    
    document.body.appendChild(chatbotContainer);
  }

  // Add chatbot functionality
  function initChatbot() {
    // DOM Elements
    const chatToggle = document.getElementById('pri0r1ty-chat-toggle');
    const chatWindow = document.getElementById('pri0r1ty-chat-window');
    const closeChat = document.getElementById('pri0r1ty-close-chat');
    const chatMessages = document.getElementById('pri0r1ty-chat-messages');
    const chatInput = document.getElementById('pri0r1ty-chat-input');
    const sendMessage = document.getElementById('pri0r1ty-send-message');
    const userInfoForm = document.getElementById('pri0r1ty-user-info-form');
    const userNameInput = document.getElementById('pri0r1ty-user-name');
    const userEmailInput = document.getElementById('pri0r1ty-user-email');
    const startChatBtn = document.getElementById('pri0r1ty-start-chat');
    const chatInputArea = document.getElementById('pri0r1ty-chat-input-area');
    
    // User info
    let userName = '';
    let userEmail = '';
    let chatSession = '';
    let gdprConsent = false;
    
    // Webhook URL - Replace with your actual webhook URL
    const WEBHOOK_URL = `${config.chatbotServerUrl}/api/chat`;
    
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
      gdprConsent = document.getElementById('pri0r1ty-gdpr-consent').checked;
      
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
      messageDiv.classList.add('pri0r1ty-message', 'pri0r1ty-user-message');
      messageDiv.textContent = text;
      chatMessages.appendChild(messageDiv);
      scrollToBottom();
    }
    
    // Add bot message to chat
    function addBotMessage(text) {
      const messageDiv = document.createElement('div');
      messageDiv.classList.add('pri0r1ty-message', 'pri0r1ty-bot-message');
      messageDiv.textContent = text;
      chatMessages.appendChild(messageDiv);
      scrollToBottom();
    }
    
    // Show typing indicator
    function showTypingIndicator() {
      const typingDiv = document.createElement('div');
      typingDiv.id = 'pri0r1ty-typing-indicator';
      typingDiv.classList.add('pri0r1ty-typing-indicator');
      typingDiv.innerHTML = '<span></span><span></span><span></span>';
      chatMessages.appendChild(typingDiv);
      scrollToBottom();
    }
    
    // Hide typing indicator
    function hideTypingIndicator() {
      const typingDiv = document.getElementById('pri0r1ty-typing-indicator');
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
  }

  // Initialize everything
  function init() {
    injectStyles();
    injectHTML();
    initChatbot();
  }

  // Run initialization
  if (document.readyState === 'complete') {
    init();
  } else {
    window.addEventListener('load', init);
  }
})();