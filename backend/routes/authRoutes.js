const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // You need this to hash passwords securely

const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Path to your Mongoose User model

// 1. Middleware to verify the JWT Token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access Denied: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Use the exact same secret key you used when generating the token during login
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'YOUR_SECRET_KEY'); 
        req.user = decoded; // req.user.id is now available
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or Expired Token' });
    }
};

// 2. The Profile Route (This is what the frontend calls!)
router.get('/profile', verifyToken, async (req, res) => {
    try {
        // Find user by ID (exclude password from the result for security)
        const user = await User.findById(req.user.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Send the data back to the frontend
        res.status(200).json({
            name: user.name,
            email: user.email,
            studentId: user.studentId,
            role: user.role,
            createdAt: user.createdAt
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});


// login route

// 3. Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // 2. Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // 3. Compare passwords using bcrypt
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // 4. Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'YOUR_SECRET_KEY',
            { expiresIn: '1d' }
        );

        // 5. Return success response
        res.status(200).json({
            token,
            name: user.name,
            email: user.email,
            role: user.role,
            message: 'Login successful'
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});


router.post('/register', async (req, res) => {
    try {
        const { name, email, studentId, password } = req.body;

        // 1. Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        // 2. Hash the password before saving it
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Create the new user
        const newUser = new User({
            name,
            email,
            studentId,
            password: hashedPassword,
            role: 'member' // Default role
        });

        // 4. Save to database
        const savedUser = await newUser.save();

        // 5. Generate a Token so they can log in immediately (optional but good UI)
        const token = jwt.sign(
            { id: savedUser._id, role: savedUser.role },
            process.env.JWT_SECRET || 'YOUR_SECRET_KEY',
            { expiresIn: '1d' }
        );

        // 6. Send success response back to frontend
        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                role: savedUser.role
            }
        });

    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
});

module.exports = router;