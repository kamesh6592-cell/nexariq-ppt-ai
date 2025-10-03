import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, ChevronRight, Download, Palette, Zap, Users, Code, Dumbbell, Star, 
  Play, Pause, RotateCcw, Image, Mic, Settings, Save, Share2, Eye, Edit3, 
  FileText, Globe, Camera, Volume2, VolumeX, Maximize, Menu, X, User, Crown,
  Sparkles, Layout, MousePointer, RefreshCw, Database, Layers, BarChart3, Moon, Sun,
  Video, MessageSquare, Figma, PenTool, Lightbulb, Target, Award, TrendingUp, Clock,
  Shield, Cloud, Sliders, BookOpen, Briefcase, Heart, Zap as Bolt, Layers as Stack
} from 'lucide-react';
import { API_URL } from '../config'; // Add this import

const Nexariq = () => {
  const [prompt, setPrompt] = useState('');
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('nexariq-dark');
  const [selectedMode, setSelectedMode] = useState('standard');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [viewMode, setViewMode] = useState('edit'); // edit, present, preview
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [user, setUser] = useState(null);
  const [savedPresentations, setSavedPresentations] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [animationStyle, setAnimationStyle] = useState('fade');
  const [presentation, setPresentation] = useState({
    title: '',
    description: '',
    tags: [],
    isPublic: false,
    collaborators: []
  });
  const [darkMode, setDarkMode] = useState(true);
  const [aiTone, setAiTone] = useState('professional');
  const [formalityLevel, setFormalityLevel] = useState('balanced');
  const [showCollaborationPanel, setShowCollaborationPanel] = useState(false);
  const [collaborators, setCollaborators] = useState([]);
  const [activeCollaborator, setActiveCollaborator] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [presentationStats, setPresentationStats] = useState({
    views: 0,
    engagement: 0,
    avgTime: 0,
    completion: 0
  });

  const canvasRef = useRef(null);
  const audioRef = useRef(null);

  // Updated themes with Nexariq branding
  const themes = {
    'nexariq-dark': {
      name: 'Nexariq Dark',
      bg: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
      cardBg: 'rgba(30, 30, 45, 0.7)',
      textColor: 'text-white',
      accent: '#6366f1',
      secondary: '#8b5cf6',
      border: 'rgba(255, 255, 255, 0.1)'
    },
    'nexariq-light': {
      name: 'Nexariq Light',
      bg: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      cardBg: 'rgba(255, 255, 255, 0.9)',
      textColor: 'text-gray-900',
      accent: '#4f46e5',
      secondary: '#7c3aed',
      border: 'rgba(0, 0, 0, 0.1)'
    },
    'creative-burst': {
      name: 'Creative Burst',
      bg: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 25%, #48dbfb 50%, #ff9ff3 75%, #54a0ff 100%)',
      cardBg: 'rgba(255, 255, 255, 0.15)',
      textColor: 'text-white',
      accent: '#ff6b6b',
      secondary: '#48dbfb',
      border: 'rgba(255, 255, 255, 0.2)'
    },
    'corporate-pro': {
      name: 'Corporate Pro',
      bg: 'linear-gradient(135deg, #2c3e50 0%, #34495e 50%, #2c3e50 100%)',
      cardBg: 'rgba(255, 255, 255, 0.08)',
      textColor: 'text-white',
      accent: '#3498db',
      secondary: '#e74c3c',
      border: 'rgba(255, 255, 255, 0.1)'
    },
    'nature-zen': {
      name: 'Nature Zen',
      bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)',
      cardBg: 'rgba(255, 255, 255, 0.1)',
      textColor: 'text-white',
      accent: '#27ae60',
      secondary: '#f39c12',
      border: 'rgba(255, 255, 255, 0.15)'
    },
    'tech-future': {
      name: 'Tech Future',
      bg: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
      cardBg: 'rgba(16, 185, 129, 0.1)',
      textColor: 'text-white',
      accent: '#10b981',
      secondary: '#3b82f6',
      border: 'rgba(16, 185, 129, 0.2)'
    }
  };

  const modes = {
    standard: { name: 'Standard', icon: Zap, desc: 'General presentations' },
    gym: { name: 'Gym Deck', icon: Dumbbell, desc: 'Fitness & health focused' },
    mythic: { name: 'Mythic Mode', icon: Star, desc: 'Cultural heritage' },
    code: { name: 'CodeCraft', icon: Code, desc: 'Technical & programming' },
    pitch: { name: 'Pitch Deck', icon: BarChart3, desc: 'Startup & business' },
    education: { name: 'EduMode', icon: BookOpen, desc: 'Teaching & learning' },
    creative: { name: 'Creative Studio', icon: PenTool, desc: 'Design & art' },
    research: { name: 'Research Lab', icon: Target, desc: 'Academic & scientific' }
  };

  const animations = {
    fade: 'Fade',
    slide: 'Slide',
    zoom: 'Zoom',
    flip: 'Flip',
    bounce: 'Bounce',
    rotate: 'Rotate',
    spiral: 'Spiral'
  };

  const toneOptions = {
    professional: 'Professional',
    casual: 'Casual',
    enthusiastic: 'Enthusiastic',
    academic: 'Academic',
    storytelling: 'Storytelling'
  };

  const formalityOptions = {
    formal: 'Formal',
    balanced: 'Balanced',
    conversational: 'Conversational'
  };

  const generateAdvancedSlides = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setShowLanding(false);
    
    try {
      const advancedPrompt = `You are Nexariq AI, an advanced presentation generation platform. Create a comprehensive, visually-rich slide deck.

Mode: ${selectedMode} - ${modes[selectedMode].desc}
Animation Style: ${animationStyle}
Tone: ${aiTone}
Formality: ${formalityLevel}

Requirements:
- Generate 8-12 slides with rich, engaging content
- Include specific visual suggestions for each slide
- Add interactive elements and call-to-actions where appropriate
- Structure content for maximum impact and engagement
- Include data points, statistics, or examples where relevant
- Ensure content matches the ${aiTone} tone and ${formalityLevel} formality level

 ${selectedMode === 'pitch' ? 'Focus on: Problem, Solution, Market, Business Model, Team, Financials, Ask' : ''}
 ${selectedMode === 'gym' ? 'Include: Workout routines, nutrition tips, progress tracking, motivation' : ''}
 ${selectedMode === 'mythic' ? 'Incorporate: Cultural elements, mythology references, traditional wisdom' : ''}
 ${selectedMode === 'code' ? 'Include: Code examples, technical diagrams, best practices, architecture' : ''}
 ${selectedMode === 'education' ? 'Focus on: Learning objectives, interactive content, assessments, resources' : ''}
 ${selectedMode === 'creative' ? 'Include: Design concepts, visual inspiration, creative processes' : ''}
 ${selectedMode === 'research' ? 'Focus on: Methodology, findings, implications, references' : ''}

Return ONLY valid JSON:
{
  "title": "Compelling Presentation Title",
  "subtitle": "Engaging subtitle",
  "metadata": {
    "estimatedDuration": "10-15 minutes",
    "targetAudience": "audience description",
    "keyTakeaways": ["takeaway1", "takeaway2", "takeaway3"]
  },
  "slides": [
    {
      "id": "unique-id",
      "title": "Slide Title",
      "content": "Rich content with bullet points or paragraphs",
      "type": "title|content|image|chart|quote|cta",
      "visual": {
        "type": "illustration|photo|chart|diagram|icon",
        "description": "Detailed visual description",
        "style": "modern|minimal|creative|professional",
        "colors": ["#color1", "#color2"]
      },
      "animation": "entrance animation suggestion",
      "interactiveElements": ["element1", "element2"],
      "speakerNotes": "Additional context for presenter"
    }
  ]
}

User Topic: "${prompt}"`;

      // Updated API call to use backend endpoint
      const response = await fetch(`${API_URL}/api/ai/generate-slides`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: advancedPrompt,
          mode: selectedMode,
          theme: selectedTheme,
          tone: aiTone,
          formality: formalityLevel
        })
      });

      const data = await response.json();
      let responseText = data.content[0].text.trim();
      responseText = responseText.replace(/```json\s*/, "").replace(/```\s*$/, "").trim();
      
      const slideData = JSON.parse(responseText);
      setSlides(slideData.slides);
      setPresentation({
        title: slideData.title,
        description: slideData.subtitle || '',
        tags: slideData.metadata?.keyTakeaways || [],
        isPublic: false,
        collaborators: []
      });
      setCurrentSlide(0);
      
      // Auto-generate images for slides
      setTimeout(() => generateSlideImages(slideData.slides), 1000);
      
    } catch (error) {
      console.error("Error generating slides:", error);
      // Enhanced fallback with demo content
      const demoSlides = [
        {
          id: 'demo-1',
          title: 'Welcome to Nexariq',
          content: 'Experience the future of presentation creation with AI-powered design, smart layouts, and interactive elements.',
          type: 'title',
          visual: {
            type: 'illustration',
            description: 'Modern tech illustration with AI elements',
            style: 'modern',
            colors: ['#6366f1', '#8b5cf6']
          },
          animation: 'fade-in',
          interactiveElements: ['Call-to-action button'],
          speakerNotes: 'Welcome the audience and introduce the AI capabilities'
        }
      ];
      setSlides(demoSlides);
      setPresentation({ title: 'Demo Presentation', description: 'AI-generated demo', tags: ['Demo', 'AI'], isPublic: false, collaborators: [] });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateSlideImages = async (slidesToProcess) => {
    setIsGeneratingImages(true);
    // Simulate AI image generation process
    setTimeout(() => {
      setIsGeneratingImages(false);
    }, 3000);
  };

  const generateVoiceover = async () => {
    if (!slides[currentSlide]) return;
    
    setIsGeneratingVoice(true);
    
    // Simulate voice generation
    setTimeout(() => {
      setIsGeneratingVoice(false);
    }, 2000);
  };

  const exportPresentation = async (format) => {
    setShowExportMenu(false);
    
    switch (format) {
      case 'pptx':
        await exportToPPTX();
        break;
      case 'pdf':
        window.print();
        break;
      case 'html':
        exportToHTML();
        break;
      case 'markdown':
        exportToMarkdown();
        break;
      case 'json':
        exportToJSON();
        break;
      case 'video':
        exportToVideo();
        break;
      case 'gif':
        exportToGIF();
        break;
    }
  };

  const exportToPPTX = async () => {
    // Simulate PPTX export
    const blob = new Blob(['PPTX Export Placeholder'], { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${presentation.title || 'presentation'}.pptx`;
    a.click();
  };

  const exportToHTML = () => {
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>${presentation.title}</title>
    <style>
        body { font-family: 'Inter', sans-serif; background: ${themes[selectedTheme].bg}; }
        .slide { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 40px; }
        .slide-content { background: ${themes[selectedTheme].cardBg}; padding: 40px; border-radius: 20px; }
        h1, h2 { color: ${themes[selectedTheme].textColor.includes('white') ? '#ffffff' : '#1f2937'}; }
    </style>
</head>
<body>
    ${slides.map(slide => `
        <div class="slide">
            <div class="slide-content">
                <h2>${slide.title}</h2>
                <div>${slide.content}</div>
            </div>
        </div>
    `).join('')}
</body>
</html>`;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${presentation.title || 'presentation'}.html`;
    a.click();
  };

  const exportToMarkdown = () => {
    const markdownContent = `# ${presentation.title}\n\n${presentation.description}\n\n${slides.map((slide, index) => `## Slide ${index + 1}: ${slide.title}\n\n${slide.content}\n\n---\n`).join('')}`;
    
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${presentation.title || 'presentation'}.md`;
    a.click();
  };

  const exportToJSON = () => {
    const jsonData = {
      presentation,
      slides,
      theme: selectedTheme,
      mode: selectedMode,
      animation: animationStyle,
      tone: aiTone,
      formality: formalityLevel
    };
    
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${presentation.title || 'presentation'}.json`;
    a.click();
  };

  const exportToVideo = () => {
    // Simulate video export
    const blob = new Blob(['Video Export Placeholder'], { type: 'video/mp4' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${presentation.title || 'presentation'}.mp4`;
    a.click();
  };

  const exportToGIF = () => {
    // Simulate GIF export
    const blob = new Blob(['GIF Export Placeholder'], { type: 'image/gif' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${presentation.title || 'presentation'}.gif`;
    a.click();
  };

  const savePresentation = async () => {
    const savedData = {
      id: Date.now().toString(),
      ...presentation,
      slides,
      theme: selectedTheme,
      mode: selectedMode,
      tone: aiTone,
      formality: formalityLevel,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const existing = savedPresentations.find(p => p.title === presentation.title);
    if (existing) {
      setSavedPresentations(prev => prev.map(p => p.id === existing.id ? { ...savedData, id: existing.id } : p));
    } else {
      setSavedPresentations(prev => [...prev, savedData]);
    }
  };

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const addCollaborator = () => {
    const newCollaborator = {
      id: Date.now().toString(),
      name: `Collaborator ${collaborators.length + 1}`,
      email: `collab${collaborators.length + 1}@example.com`,
      role: 'editor',
      active: true,
      lastActive: new Date().toISOString()
    };
    setCollaborators([...collaborators, newCollaborator]);
    setActiveCollaborator(newCollaborator);
  };

  const removeCollaborator = (id) => {
    setCollaborators(collaborators.filter(c => c.id !== id));
    if (activeCollaborator && activeCollaborator.id === id) {
      setActiveCollaborator(collaborators.length > 1 ? collaborators[0] : null);
    }
  };

  // Auto-play functionality
  useEffect(() => {
    let interval;
    if (isPlaying && slides.length > 0) {
      interval = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % slides.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, slides.length]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (viewMode === 'present') {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 'Escape') setViewMode('edit');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [viewMode, currentSlide, slides.length]);

  // Simulate presentation stats
  useEffect(() => {
    if (slides.length > 0) {
      setPresentationStats({
        views: Math.floor(Math.random() * 1000) + 100,
        engagement: Math.floor(Math.random() * 100) + 50,
        avgTime: Math.floor(Math.random() * 5) + 2,
        completion: Math.floor(Math.random() * 30) + 70
      });
    }
  }, [slides]);

  const currentTheme = themes[selectedTheme];

  if (showLanding) {
    return (
      <div className="min-h-screen" style={{ background: currentTheme.bg }}>
        {/* Landing Page */}
        <div className="relative min-h-screen text-white">
          {/* Hero Section */}
          <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
            <div className="text-center space-y-8">
              <div className="flex items-center justify-center space-x-3 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center">
                  <img 
                    src="https://z-cdn-media.chatglm.cn/files/5cf194df-8696-423c-8819-5d0b1cb49a25_Flat%20Vector%20Logo%20with%20Text%20%27N%27_20250922_195120_0000.png?auth_key=1790503004-a232037eb91d4274b94c32aab91e0dbd-0-4e741b66fe782baebe0edd22d3795b26" 
                    alt="Nexariq Logo" 
                    className="w-10 h-10"
                  />
                </div>
                <div>
                  <h1 className="text-5xl font-bold">Nexariq</h1>
                  <p className="text-xl opacity-80">AI-Powered Presentation Platform</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <h2 className="text-6xl font-bold leading-tight">
                  Create Stunning
                  <br />
                  <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    AI Presentations
                  </span>
                </h2>
                <p className="text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed">
                  Transform your ideas into professional presentations with advanced AI, 
                  smart design, voice synthesis, and interactive elements - all in seconds.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <button
                  onClick={() => setShowLanding(false)}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-semibold text-lg hover:opacity-90 transition-all duration-300 flex items-center space-x-2 shadow-lg shadow-blue-500/20"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Start Creating</span>
                </button>
                <button className="px-8 py-4 bg-white/10 backdrop-blur-md rounded-2xl font-semibold text-lg hover:bg-white/20 transition-all duration-300">
                  Watch Demo
                </button>
              </div>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
              {[
                { icon: Bolt, title: 'Advanced AI', desc: 'Next-gen content creation' },
                { icon: Image, title: 'Smart Visuals', desc: 'Auto-generated images' },
                { icon: Volume2, title: 'Voice Synthesis', desc: 'Professional narration' },
                { icon: Download, title: 'Multi-Export', desc: 'PPTX, PDF, Video, GIF' },
                { icon: Layers, title: 'Premium Themes', desc: 'Designer-quality templates' },
                { icon: Users, title: 'Collaboration', desc: 'Real-time team editing' },
                { icon: Crown, title: 'Specialized Modes', desc: 'Pitch, Education, Code' },
                { icon: MousePointer, title: 'Interactive', desc: 'Clickable elements' }
              ].map((feature, idx) => (
                <div key={idx} className="group p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                  <feature.icon className="w-12 h-12 mb-4 text-blue-400 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="opacity-80 text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-20 text-center">
              <div>
                <div className="text-4xl font-bold text-blue-400">25K+</div>
                <div className="opacity-80">Presentations Created</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-400">100+</div>
                <div className="opacity-80">Design Themes</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-400">99.5%</div>
                <div className="opacity-80">User Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white" style={{ background: currentTheme.bg }}>
      {/* Advanced Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/10 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <img 
                    src="https://z-cdn-media.chatglm.cn/files/5cf194df-8696-423c-8819-5d0b1cb49a25_Flat%20Vector%20Logo%20with%20Text%20%27N%27_20250922_195120_0000.png?auth_key=1790503004-a232037eb91d4274b94c32aab91e0dbd-0-4e741b66fe782baebe0edd22d3795b26" 
                    alt="Nexariq Logo" 
                    className="w-6 h-6"
                  />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Nexariq</h1>
                  <div className="text-xs opacity-60">Pro Edition</div>
                </div>
              </div>
              
              {presentation.title && (
                <div className="hidden md:block">
                  <input
                    type="text"
                    value={presentation.title}
                    onChange={(e) => setPresentation(prev => ({ ...prev, title: e.target.value }))}
                    className="bg-transparent border-none text-lg font-medium focus:outline-none focus:ring-1 focus:ring-white/20 rounded px-2 py-1"
                  />
                </div>
              )}
            </div>

            {/* Desktop Controls */}
            <div className="hidden lg:flex items-center space-x-3">
              <select
                value={selectedMode}
                onChange={(e) => setSelectedMode(e.target.value)}
                className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm"
              >
                {Object.entries(modes).map(([key, mode]) => (
                  <option key={key} value={key} className="bg-gray-800 text-white">
                    {mode.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedTheme}
                onChange={(e) => setSelectedTheme(e.target.value)}
                className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm"
              >
                {Object.entries(themes).map(([key, theme]) => (
                  <option key={key} value={key} className="bg-gray-800 text-white">
                    {theme.name}
                  </option>
                ))}
              </select>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setViewMode('edit')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'edit' ? 'bg-white/20' : 'hover:bg-white/10'}`}
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('preview')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'preview' ? 'bg-white/20' : 'hover:bg-white/10'}`}
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('present')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'present' ? 'bg-white/20' : 'hover:bg-white/10'}`}
                >
                  <Maximize className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => setShowCollaborationPanel(!showCollaborationPanel)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Users className="w-4 h-4" />
              </button>

              <button
                onClick={() => setShowAnalytics(!showAnalytics)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              <button
                onClick={savePresentation}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>

                {showExportMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-gray-900/95 backdrop-blur-md rounded-lg border border-white/10 shadow-xl">
                    {[
                      { format: 'pptx', name: 'PowerPoint', icon: FileText },
                      { format: 'pdf', name: 'PDF', icon: FileText },
                      { format: 'html', name: 'HTML', icon: Globe },
                      { format: 'markdown', name: 'Markdown', icon: FileText },
                      { format: 'json', name: 'JSON Data', icon: Database },
                      { format: 'video', name: 'Video', icon: Video },
                      { format: 'gif', name: 'GIF', icon: Video }
                    ].map(({ format, name, icon: Icon }) => (
                      <button
                        key={format}
                        onClick={() => exportPresentation(format)}
                        className="w-full px-4 py-3 text-left hover:bg-white/10 flex items-center space-x-3 first:rounded-t-lg last:rounded-b-lg"
                      >
                        <Icon className="w-4 h-4" />
                        <span>{name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="lg:hidden mt-4 p-4 bg-black/20 rounded-lg backdrop-blur-md space-y-3">
              <select
                value={selectedMode}
                onChange={(e) => setSelectedMode(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-sm"
              >
                {Object.entries(modes).map(([key, mode]) => (
                  <option key={key} value={key} className="bg-gray-800 text-white">
                    {mode.name} - {mode.desc}
                  </option>
                ))}
              </select>
              
              <div className="grid grid-cols-2 gap-2">
                <button onClick={savePresentation} className="px-3 py-2 rounded-lg bg-white/10 text-sm flex items-center justify-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>
                <button onClick={() => setShowExportMenu(true)} className="px-3 py-2 rounded-lg bg-white/10 text-sm flex items-center justify-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {slides.length === 0 ? (
          /* Enhanced Input Section */
          <div className="space-y-8">
            <div className="text-center space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Create Your Next
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Masterpiece
                </span>
              </h2>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                Describe your vision, and our advanced AI will craft a complete presentation with smart design, interactive elements, and professional polish.
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
              {/* Mode Selection */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(modes).map(([key, mode]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedMode(key)}
                    className={`p-4 rounded-xl border transition-all duration-300 ${
                      selectedMode === key 
                        ? 'bg-white/20 border-white/30' 
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <mode.icon className="w-8 h-8 mx-auto mb-2" style={{ color: currentTheme.accent }} />
                    <div className="font-medium">{mode.name}</div>
                    <div className="text-xs opacity-70 mt-1">{mode.desc}</div>
                  </button>
                ))}
              </div>

              {/* Advanced Prompt Input */}
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={`${selectedMode === 'pitch' ? 'Create a pitch deck for my AI-powered meditation app targeting busy professionals. Include market size, competitive analysis, and funding requirements...' : 
                    selectedMode === 'gym' ? 'Design a comprehensive fitness presentation covering HIIT workouts, nutrition plans, and progress tracking for beginners...' :
                    selectedMode === 'mythic' ? 'Create a presentation about cultural heritage, featuring traditional art forms, historical significance, and modern relevance...' :
                    selectedMode === 'code' ? 'Build a technical presentation about microservices architecture, including design patterns, deployment strategies, and best practices...' :
                    selectedMode === 'education' ? 'Develop an educational presentation about climate change, with interactive elements, data visualizations, and actionable solutions...' :
                    selectedMode === 'creative' ? 'Design a creative presentation about modern art trends, featuring influential artists and emerging techniques...' :
                    selectedMode === 'research' ? 'Create a research presentation about renewable energy innovations, including recent studies and future projections...' :
                    'Describe your presentation topic in detail. Include key points, target audience, and desired outcome...'}`}
                  className="w-full h-40 p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 placeholder-white/50 text-white resize-none text-lg focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30"
                />
                <div className="absolute top-4 right-4 flex items-center space-x-2">
                  {React.createElement(modes[selectedMode].icon, { 
                    className: "w-6 h-6 opacity-60" 
                  })}
                  <div className="text-sm opacity-60">{modes[selectedMode].name}</div>
                </div>
              </div>
              
              {/* Advanced Options */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-80">Theme Style</label>
                  <select
                    value={selectedTheme}
                    onChange={(e) => setSelectedTheme(e.target.value)}
                    className="w-full px-3 py-3 rounded-xl bg-white/10 border border-white/20 text-white"
                  >
                    {Object.entries(themes).map(([key, theme]) => (
                      <option key={key} value={key} className="bg-gray-800 text-white">
                        {theme.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-80">Animation Style</label>
                  <select
                    value={animationStyle}
                    onChange={(e) => setAnimationStyle(e.target.value)}
                    className="w-full px-3 py-3 rounded-xl bg-white/10 border border-white/20 text-white"
                  >
                    {Object.entries(animations).map(([key, name]) => (
                      <option key={key} value={key} className="bg-gray-800 text-white">
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-80">AI Tone</label>
                  <select
                    value={aiTone}
                    onChange={(e) => setAiTone(e.target.value)}
                    className="w-full px-3 py-3 rounded-xl bg-white/10 border border-white/20 text-white"
                  >
                    {Object.entries(toneOptions).map(([key, name]) => (
                      <option key={key} value={key} className="bg-gray-800 text-white">
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-80">Formality Level</label>
                  <select
                    value={formalityLevel}
                    onChange={(e) => setFormalityLevel(e.target.value)}
                    className="w-full px-3 py-3 rounded-xl bg-white/10 border border-white/20 text-white"
                  >
                    {Object.entries(formalityOptions).map(([key, name]) => (
                      <option key={key} value={key} className="bg-gray-800 text-white">
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Generate Button */}
              <button
                onClick={generateAdvancedSlides}
                disabled={isGenerating || !prompt.trim()}
                className="w-full py-5 rounded-2xl font-semibold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                style={{ 
                  background: isGenerating ? 'rgba(255,255,255,0.1)' : `linear-gradient(45deg, ${currentTheme.accent}, ${currentTheme.secondary})`
                }}
              >
                {isGenerating ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Crafting Your Masterpiece...</span>
                    <div className="text-sm opacity-70">AI is thinking...</div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-3">
                    <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                    <span>Generate AI Presentation</span>
                    <div className="text-sm opacity-80">Advanced Mode</div>
                  </div>
                )}
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </div>

            {/* Enhanced Feature Showcase */}
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-center mb-8">Nexariq Advanced Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: Image, title: 'AI Visuals', desc: 'Auto-generated images, charts, and diagrams', color: currentTheme.accent },
                  { icon: Volume2, title: 'Voice Synthesis', desc: 'Professional AI-generated narration', color: currentTheme.secondary },
                  { icon: Layout, title: 'Smart Layouts', desc: 'Intelligent content positioning', color: '#10b981' },
                  { icon: MousePointer, title: 'Interactive Elements', desc: 'Clickable buttons and animations', color: '#f59e0b' },
                  { icon: RefreshCw, title: 'Real-time Editing', desc: 'Live collaboration and updates', color: '#ef4444' },
                  { icon: Crown, title: 'Premium Themes', desc: 'Designer-quality templates', color: '#8b5cf6' },
                  { icon: BarChart3, title: 'Data Visualization', desc: 'Smart charts and infographics', color: '#06b6d4' },
                  { icon: Globe, title: 'Multi-format Export', desc: 'PPTX, PDF, Video, GIF, HTML', color: '#ec4899' }
                ].map((feature, idx) => (
                  <div key={idx} className="group p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:rotate-1">
                    <feature.icon className="w-12 h-12 mb-4 group-hover:scale-110 transition-transform duration-300" style={{ color: feature.color }} />
                    <h4 className="text-lg font-semibold mb-2">{feature.title}</h4>
                    <p className="opacity-80 text-sm">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Presentations */}
            {savedPresentations.length > 0 && (
              <div className="mt-16">
                <h3 className="text-2xl font-bold mb-6">Recent Presentations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedPresentations.slice(0, 3).map((pres) => (
                    <div key={pres.id} className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all duration-300 group cursor-pointer">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-lg group-hover:text-blue-400 transition-colors">{pres.title}</h4>
                          <p className="opacity-60 text-sm">{pres.description}</p>
                        </div>
                        <div className="text-xs opacity-50">
                          {new Date(pres.updatedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          {pres.tags?.slice(0, 2).map((tag, i) => (
                            <span key={i} className="px-2 py-1 bg-white/10 rounded-lg text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 opacity-60" />
                          <span className="text-xs opacity-60">{pres.collaborators?.length || 0}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Enhanced Slide Viewer */
          <div className="space-y-6">
            {/* Advanced Controls Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <button
                  onClick={prevSlide}
                  disabled={currentSlide === 0}
                  className="p-3 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-medium">
                    {currentSlide + 1} / {slides.length}
                  </span>
                  <div className="text-sm opacity-60">
                    {slides[currentSlide]?.type || 'content'}
                  </div>
                </div>
                
                <button
                  onClick={nextSlide}
                  disabled={currentSlide === slides.length - 1}
                  className="p-3 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center space-x-3">
                {/* AI Enhancement Buttons */}
                <button
                  onClick={generateSlideImages}
                  disabled={isGeneratingImages}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors flex items-center space-x-2 disabled:opacity-50"
                >
                  {isGeneratingImages ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <Image className="w-4 h-4" />
                  )}
                  <span className="text-sm">AI Images</span>
                </button>

                <button
                  onClick={generateVoiceover}
                  disabled={isGeneratingVoice}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors flex items-center space-x-2 disabled:opacity-50"
                >
                  {isGeneratingVoice ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                  <span className="text-sm">Voice</span>
                </button>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors flex items-center space-x-2"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span className="text-sm">{isPlaying ? 'Pause' : 'Auto-play'}</span>
                </button>
              </div>
            </div>

            {/* Main Slide Display */}
            <div className="relative">
              <div 
                className={`min-h-[600px] md:min-h-[700px] p-8 md:p-12 rounded-3xl shadow-2xl ${currentTheme.textColor} transition-all duration-700 relative overflow-hidden`}
                style={{ 
                  background: currentTheme.cardBg, 
                  backdropFilter: 'blur(20px)',
                  animation: animationStyle === 'fade' ? 'fadeIn 0.5s ease-in-out' : 
                            animationStyle === 'slide' ? 'slideIn 0.5s ease-in-out' :
                            animationStyle === 'zoom' ? 'zoomIn 0.5s ease-in-out' :
                            animationStyle === 'flip' ? 'flipIn 0.5s ease-in-out' :
                            animationStyle === 'rotate' ? 'rotateIn 0.5s ease-in-out' :
                            'spiralIn 0.5s ease-in-out'
                }}
              >
                {slides[currentSlide] && (
                  <div className="h-full flex flex-col justify-center space-y-8 relative z-10">
                    {/* Slide Type Indicator */}
                    <div className="absolute top-4 right-4 px-3 py-1 bg-white/10 rounded-full text-xs font-medium opacity-60">
                      {slides[currentSlide].type?.toUpperCase() || 'CONTENT'}
                    </div>

                    {/* Main Content */}
                    <div className="space-y-6">
                      <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                        {slides[currentSlide].title}
                      </h2>
                      
                      <div className="text-xl md:text-2xl leading-relaxed opacity-90 whitespace-pre-wrap">
                        {slides[currentSlide].content}
                      </div>
                    </div>

                    {/* Visual Suggestions */}
                    {slides[currentSlide].visual && (
                      <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/10">
                        <div className="flex items-start space-x-3">
                          <Camera className="w-5 h-5 mt-1 opacity-60" />
                          <div>
                            <div className="text-sm font-medium opacity-80">AI Visual Suggestion</div>
                            <div className="text-sm opacity-60 mt-1">
                              {typeof slides[currentSlide].visual === 'object' 
                                ? slides[currentSlide].visual.description 
                                : slides[currentSlide].visual}
                            </div>
                            {slides[currentSlide].visual.colors && (
                              <div className="flex items-center space-x-2 mt-2">
                                <span className="text-xs opacity-60">Colors:</span>
                                {slides[currentSlide].visual.colors.map((color, i) => (
                                  <div key={i} className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: color }}></div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Interactive Elements */}
                    {slides[currentSlide].interactiveElements && slides[currentSlide].interactiveElements.length > 0 && (
                      <div className="mt-6 space-y-3">
                        {slides[currentSlide].interactiveElements.map((element, i) => (
                          <button 
                            key={i}
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-semibold hover:scale-105 transition-transform duration-200"
                          >
                            {element}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Speaker Notes */}
                    {slides[currentSlide].speakerNotes && (
                      <div className="mt-8 p-4 bg-black/20 rounded-2xl">
                        <div className="flex items-start space-x-3">
                          <Volume2 className="w-5 h-5 mt-1 opacity-60" />
                          <div>
                            <div className="text-sm font-medium opacity-80">Speaker Notes</div>
                            <div className="text-sm opacity-70 mt-1">
                              {slides[currentSlide].speakerNotes}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Background Animation Effects */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full filter blur-3xl animate-pulse"></div>
                  <div className="absolute bottom-10 left-10 w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full filter blur-3xl animate-pulse animation-delay-1000"></div>
                </div>
              </div>

              {/* Slide Navigation Dots */}
              <div className="flex justify-center mt-8 space-x-3">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`transition-all duration-300 hover:scale-125 ${
                      idx === currentSlide 
                        ? 'w-8 h-3 bg-white rounded-full' 
                        : 'w-3 h-3 bg-white/30 rounded-full hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Slide Thumbnail Strip */}
            <div className="mt-8 overflow-x-auto">
              <div className="flex space-x-4 pb-4">
                {slides.map((slide, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`flex-shrink-0 w-48 h-32 p-4 rounded-xl border-2 transition-all duration-300 ${
                      idx === currentSlide 
                        ? 'border-white bg-white/20 scale-105' 
                        : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="text-xs font-medium mb-2 truncate">{slide.title}</div>
                    <div className="text-xs opacity-60 line-clamp-3">{slide.content.substring(0, 80)}...</div>
                    <div className="text-xs mt-2 opacity-50">{idx + 1}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Collaboration Panel */}
            {showCollaborationPanel && (
              <div className="mt-8 p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>Collaboration</span>
                  </h3>
                  <button 
                    onClick={addCollaborator}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm font-medium transition-colors"
                  >
                    Add Collaborator
                  </button>
                </div>
                
                <div className="space-y-4">
                  {collaborators.length > 0 ? (
                    collaborators.map(collab => (
                      <div 
                        key={collab.id} 
                        className={`p-4 rounded-xl border transition-all duration-300 ${
                          activeCollaborator?.id === collab.id 
                            ? 'border-blue-400 bg-blue-500/10' 
                            : 'border-white/10 bg-white/5 hover:bg-white/10'
                        }`}
                        onClick={() => setActiveCollaborator(collab)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-medium">
                              {collab.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium">{collab.name}</div>
                              <div className="text-sm opacity-60">{collab.email}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${collab.active ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                removeCollaborator(collab.id);
                              }}
                              className="p-1 rounded hover:bg-white/10 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 opacity-60">
                      No collaborators yet. Add team members to work together in real-time.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Analytics Panel */}
            {showAnalytics && (
              <div className="mt-8 p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
                <h3 className="text-xl font-semibold flex items-center space-x-2 mb-6">
                  <BarChart3 className="w-5 h-5" />
                  <span>Presentation Analytics</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center space-x-3 mb-2">
                      <Eye className="w-5 h-5 text-blue-400" />
                      <span className="text-sm opacity-70">Total Views</span>
                    </div>
                    <div className="text-2xl font-bold">{presentationStats.views}</div>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center space-x-3 mb-2">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                      <span className="text-sm opacity-70">Engagement</span>
                    </div>
                    <div className="text-2xl font-bold">{presentationStats.engagement}%</div>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center space-x-3 mb-2">
                      <Clock className="w-5 h-5 text-yellow-400" />
                      <span className="text-sm opacity-70">Avg. Time</span>
                    </div>
                    <div className="text-2xl font-bold">{presentationStats.avgTime}m</div>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center space-x-3 mb-2">
                      <Award className="w-5 h-5 text-purple-400" />
                      <span className="text-sm opacity-70">Completion</span>
                    </div>
                    <div className="text-2xl font-bold">{presentationStats.completion}%</div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-medium mb-3">Performance Over Time</h4>
                  <div className="h-32 rounded-xl bg-white/5 border border-white/10 flex items-end space-x-1 p-2">
                    {[65, 75, 80, 70, 85, 90, 95].map((value, idx) => (
                      <div 
                        key={idx} 
                        className="flex-1 bg-gradient-to-t from-blue-500 to-purple-500 rounded-t"
                        style={{ height: `${value}%` }}
                      ></div>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs opacity-60 mt-2 px-2">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                  </div>
                </div>
              </div>
            )}

            {/* Presentation Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-2xl font-bold" style={{ color: currentTheme.accent }}>
                  {slides.length}
                </div>
                <div className="text-sm opacity-70">Total Slides</div>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-2xl font-bold" style={{ color: currentTheme.secondary }}>
                  ~{Math.ceil(slides.length * 1.5)}
                </div>
                <div className="text-sm opacity-70">Est. Minutes</div>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-2xl font-bold text-green-400">
                  {slides.filter(s => s.visual).length}
                </div>
                <div className="text-sm opacity-70">With Visuals</div>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-2xl font-bold text-yellow-400">
                  {selectedMode.charAt(0).toUpperCase() + selectedMode.slice(1)}
                </div>
                <div className="text-sm opacity-70">Mode</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes zoomIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes flipIn {
          from { transform: rotateY(-90deg); opacity: 0; }
          to { transform: rotateY(0); opacity: 1; }
        }
        @keyframes rotateIn {
          from { transform: rotate(-10deg) scale(0.8); opacity: 0; }
          to { transform: rotate(0) scale(1); opacity: 1; }
        }
        @keyframes spiralIn {
          0% { transform: rotate(0deg) scale(0.5); opacity: 0; }
          50% { transform: rotate(180deg) scale(1.1); opacity: 0.7; }
          100% { transform: rotate(360deg) scale(1); opacity: 1; }
        }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Nexariq;
