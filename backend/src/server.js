const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false
}));

// IMPORTANT: Update these URLs after deploying frontend
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://nexariq-platform.vercel.app',
    'https://nexariq-ppt-ai-noul.vercel.app', // UPDATE THIS after frontend deployment
    /\.vercel\.app$/
  ],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

// AI rate limiting
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10
});

// Database connection (optional)
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB error:', err));
}

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV
  });
});

// AI Generation endpoint
app.post('/api/ai/generate-slides', aiLimiter, async (req, res) => {
  try {
    const { prompt, mode, theme, tone, formality } = req.body;

    if (!prompt || prompt.trim().length === 0) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!process.env.CLAUDE_API_KEY) {
      console.error('CLAUDE_API_KEY not set');
      return res.status(500).json({ error: 'API key not configured' });
    }

    const systemPrompt = `You are Nexariq AI, an advanced presentation generator. Create a comprehensive slide deck.

Mode: ${mode || 'standard'}
Theme: ${theme || 'nexariq-dark'}
Tone: ${tone || 'professional'}
Formality: ${formality || 'balanced'}

Return ONLY valid JSON with this structure:
{
  "title": "Presentation Title",
  "subtitle": "Engaging subtitle",
  "metadata": {
    "estimatedDuration": "10-15 minutes",
    "targetAudience": "audience description",
    "keyTakeaways": ["takeaway1", "takeaway2", "takeaway3"]
  },
  "slides": [
    {
      "id": "slide-1",
      "title": "Slide Title",
      "content": "Rich content with details",
      "type": "title",
      "visual": {
        "type": "illustration",
        "description": "Visual description",
        "style": "modern",
        "colors": ["#6366f1", "#8b5cf6"]
      },
      "animation": "fade-in",
      "interactiveElements": ["CTA button"],
      "speakerNotes": "Speaker guidance"
    }
  ]
}

Topic: "${prompt}"`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        messages: [
          { role: "user", content: systemPrompt }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Claude API error:', response.status, errorText);
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    let responseText = data.content[0].text.trim();
    
    // Clean response
    responseText = responseText.replace(/```json\s*/, "").replace(/```\s*$/, "").trim();
    
    const slideData = JSON.parse(responseText);
    
    res.json(slideData);
  } catch (error) {
    console.error('AI Generation Error:', error);
    
    // Fallback demo response
    const demoResponse = {
      title: "Demo Presentation",
      subtitle: "AI-generated content demo",
      metadata: {
        estimatedDuration: "5-10 minutes",
        targetAudience: "General audience",
        keyTakeaways: ["Demo", "AI-powered", "Nexariq"]
      },
      slides: [
        {
          id: "demo-1",
          title: "Welcome to Nexariq",
          content: "Your AI-powered presentation platform. Create stunning slides in seconds with advanced AI technology.",
          type: "title",
          visual: {
            type: "illustration",
            description: "Modern tech design with AI elements",
            style: "modern",
            colors: ["#6366f1", "#8b5cf6"]
          },
          animation: "fade-in",
          interactiveElements: ["Get Started"],
          speakerNotes: "Welcome audience and introduce Nexariq capabilities"
        },
        {
          id: "demo-2",
          title: "AI-Powered Features",
          content: "• Smart content generation\n• Professional themes\n• Export to multiple formats\n• Real-time collaboration",
          type: "content",
          visual: {
            type: "chart",
            description: "Feature comparison chart",
            style: "professional",
            colors: ["#3b82f6", "#10b981"]
          },
          animation: "slide-in",
          interactiveElements: ["Learn More"],
          speakerNotes: "Highlight key features that make Nexariq unique"
        }
      ]
    };
    
    res.json(demoResponse);
  }
});

// Presentations endpoints
app.get('/api/presentations', (req, res) => {
  res.json({ presentations: [] });
});

app.post('/api/presentations', async (req, res) => {
  try {
    const presentation = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString()
    };
    
    res.status(201).json(presentation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Export endpoints
app.post('/api/export/pptx', (req, res) => {
  try {
    const { presentation } = req.body;
    
    res.json({ 
      message: 'PPTX export initiated',
      downloadUrl: '/api/download/demo.pptx'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Nexariq Backend running on port ${PORT}`);
});
// Update CORS configuration in backend/src/server.js
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://nexariq-ppt-ai-noul.vercel.app', // UPDATE with your actual frontend URL
    /\.vercel\.app$/ // Allows all Vercel preview deployments
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Vercel export
module.exports = app;
