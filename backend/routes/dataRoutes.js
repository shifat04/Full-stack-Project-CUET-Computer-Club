const express = require('express');
const Event = require('../models/Event');
const Contest = require('../models/Contest');
const News = require('../models/News');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Get all events (Sorted newest first)
router.get('/events', async (req, res) => {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
});

// Get all contests
router.get('/contests', async (req, res) => {
    const contests = await Contest.find().sort({ createdAt: -1 });
    res.json(contests);
});

// Get all news
router.get('/news', async (req, res) => {
    const news = await News.find().sort({ createdAt: -1 });
    res.json(news);
});

// Member Registers for a contest (Requires login token)
router.post('/contests/register/:id', verifyToken, async (req, res) => {
    try {
        const contest = await Contest.findById(req.params.id);
        
        // Check if user is already registered
        if (contest.participants.includes(req.user.id)) {
            return res.status(400).json({ message: 'You are already registered for this contest!' });
        }

        // Add user ID to participants array
        contest.participants.push(req.user.id);
        await contest.save();

        res.json({ message: 'Successfully registered for the contest!' });
    } catch (err) {
        res.status(500).json({ message: 'Server error during registration' });
    }
});

module.exports = router;