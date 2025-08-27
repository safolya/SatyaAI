const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  userId: {
    type: String, // Firebase UID
    required: true,
    index: true
  },
  originalContent: {
    type: String, // will store the user's url or raw text
    required: true,
  },
  credibilityReport: {
    type: Object, // will store the structured json from gemini
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

// Update the updatedAt field on save
reportSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("Report", reportSchema);
