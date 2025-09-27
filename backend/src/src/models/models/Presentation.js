const mongoose = require('mongoose');

const presentationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  slides: [{
    id: String,
    title: String,
    content: String,
    type: String,
    visual: mongoose.Mixed,
    animation: String,
    interactiveElements: [String],
    speakerNotes: String
  }],
  settings: {
    theme: String,
    mode: String,
    animationStyle: String
  },
  metadata: {
    estimatedDuration: String,
    targetAudience: String,
    keyTakeaways: [String]
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Presentation', presentationSchema);
