const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: String, required: true },
    prize: { type: String, required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Stores who registered
}, { timestamps: true });

module.exports = mongoose.model('Contest', contestSchema);