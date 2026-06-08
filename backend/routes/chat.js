const express = require('express');
const router = express.Router();

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const SYSTEM_PROMPT = `You are AuraBot, a helpful shopping assistant for AuraStore — an e-commerce store selling electronics, accessories, computers, wearables, home goods, sports equipment, and furniture.

Your role is to help users with:
- Answering product questions based on what you know
- Providing shopping recommendations
- Helping with order inquiries
- General customer support

Keep responses friendly, concise, and helpful. If asked about something outside your scope, politely redirect to the shopping experience.`;

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ reply: 'Please say something!' });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.json({ reply: '🔧 AI assistant is being configured. Please check back soon!' });
    }

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Groq API error:', response.status, errText);
      return res.status(500).json({ reply: 'Sorry, I ran into an issue. Please try again.' });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'No response generated.';
    res.json({ reply });

  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ reply: 'Something went wrong. Please try again later.' });
  }
});

module.exports = router;
