const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Your LLM API details
const LLM_API_URL = process.env.LLM_API_URL || 'https://api.your-llm-provider.com/v1/chat/completions';
const LLM_API_KEY = process.env.LLM_API_KEY || 'your-api-key';

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: '*', // In production, specify your website domain for security
  methods: ['POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Simple in-memory storage for user sessions (replace with a database in production)
const sessions = {};

// Webhook endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, userName, userEmail, sessionId, gdprConsent, timestamp } = req.body;
    
    // Validate required fields
    if (!message || !userName || !userEmail || !sessionId) {
      return res.status(400).json({ 
        message: 'Missing required fields. Please provide message, userName, userEmail, and sessionId.'
      });
    }
    
    // Check for GDPR consent
    if (gdprConsent !== true) {
      return res.status(400).json({
        message: 'GDPR consent is required.'
      });
    }
    
    // Store or update session info
    if (!sessions[sessionId]) {
      sessions[sessionId] = {
        userName,
        userEmail,
        gdprConsent,
        messages: [],
        startedAt: timestamp || new Date().toISOString()
      };
    }
    
    // Add the new message to session history
    sessions[sessionId].messages.push({
      role: 'user',
      content: message,
      timestamp: timestamp || new Date().toISOString()
    });
    
    // Create context for the LLM
    const conversationHistory = sessions[sessionId].messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    // Add system message at the beginning for context
    conversationHistory.unshift({
      role: 'system',
      content: `You are a helpful website assistant chatting with ${userName} (${userEmail}). Provide friendly, concise responses.`
    });
    
    // Call external LLM API
    const llmResponse = await axios.post(
      LLM_API_URL,
      {
        model: 'gpt-3.5-turbo', // Change to your LLM model
        messages: conversationHistory,
        max_tokens: 500,
        temperature: 0.7
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${LLM_API_KEY}`
        }
      }
    );
    
    // Extract the LLM's response
    const botResponse = llmResponse.data.choices[0].message.content;
    
    // Store the bot's response in session history
    sessions[sessionId].messages.push({
      role: 'assistant',
      content: botResponse,
      timestamp: new Date().toISOString()
    });
    
    // Log the interaction (you could save to a database here)
    console.log(`[${sessionId}] User: ${message}`);
    console.log(`[${sessionId}] Bot: ${botResponse}`);
    
    // Return the response to the chatbot
    return res.json({
      message: botResponse
    });
    
  } catch (error) {
    console.error('Error processing request:', error);
    
    // If it's an API error with a response
    if (error.response) {
      console.error('API Error:', error.response.data);
    }
    
    return res.status(500).json({
      message: 'Sorry, I encountered an error processing your request. Please try again later.'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Webhook server running on port ${PORT}`);
});