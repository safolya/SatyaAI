const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
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
});

module.exports = mongoose.model('Report', reportSchema);