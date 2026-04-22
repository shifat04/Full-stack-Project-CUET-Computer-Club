const express = require('express');
const User = require('../models/User');
const Event = require('../models/Event');
const Contest = require('../models/Contest');
const News = require('../models/News');
const { verifyToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Apply middleware to ALL routes in this file (Must be logged in AND an Admin)
router.use(verifyToken, isAdmin);

// ================= USERS =================
router.get('/users', async (req, res) => {
    const users = await User.find().select('-password'); // Get all users, hide passwords
    res.json(users);
});

router.put('/users/promote/:id', async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, { role: 'admin' });
    res.json({ message: 'User promoted to Admin!' });
});

router.delete('/users/:id', async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully!' });
});

// ================= EVENTS =================
router.post('/events', async (req, res) => {
    const newEvent = new Event(req.body);
    await newEvent.save();
    res.json({ message: 'Event created successfully!' });
});

router.delete('/events/:id', async (req, res) => {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted successfully!' });
});

// ================= CONTESTS =================
router.post('/contests', async (req, res) => {
    const newContest = new Contest(req.body);
    await newContest.save();
    res.json({ message: 'Contest created successfully!' });
});

router.delete('/contests/:id', async (req, res) => {
    await Contest.findByIdAndDelete(req.params.id);
    res.json({ message: 'Contest deleted successfully!' });
});

// ================= NEWS =================
router.post('/news', async (req, res) => {
    const newNews = new News(req.body);
    await newNews.save();
    res.json({ message: 'News published successfully!' });
});

router.delete('/news/:id', async (req, res) => {
    await News.findByIdAndDelete(req.params.id);
    res.json({ message: 'News deleted successfully!' });
});

module.exports = router;