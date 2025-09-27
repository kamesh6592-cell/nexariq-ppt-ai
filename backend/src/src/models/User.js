const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  plan: { type: String, enum: ['free', 'pro', 'enterprise'], default: 'free' },
  usage: {
    presentationsCreated: { type: Number, default: 0 },
    aiGenerationsUsed: { type: Number, default: 0 }
  },
  preferences: {
    defaultTheme: { type: String, default: 'nexariq-dark' },
    defaultMode: { type: String, default: 'standard' }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
