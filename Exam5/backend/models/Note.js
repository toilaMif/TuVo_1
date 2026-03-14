const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Compound unique index: title + user (each user can have unique titles)
noteSchema.index({ title: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Note', noteSchema);