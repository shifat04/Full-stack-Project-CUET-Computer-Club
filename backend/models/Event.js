const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: String, required: true },
    location: { type: String, required: true },
    capacity: { type: Number },
    description: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);