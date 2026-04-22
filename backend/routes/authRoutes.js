const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();



const { verifyToken } = require('../middleware/auth');




// SIGNUP ROUTE
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, studentId } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = new User({ name, email, password: hashedPassword, studentId });
        await newUser.save();

        res.status(201).json({ message: "User created successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// LOGIN ROUTE
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Generate Token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send back token, name, and role
        res.status(200).json({ token, role: user.role, name: user.name });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Get User Profile

router.get('/profile', verifyToken, async (req, res) => {

    try {

        // Find user by ID (from the token), but don't send the password back!

        const user = await User.findById(req.user.id).select('-password');

        res.json(user);

    } catch (error) {

        console.log(erro);

        res.status(500).json({ message: 'Server Error' });

    }

});





module.exports = router;