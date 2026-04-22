const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();

// 1. MIDDLEWARE (Must be declared BEFORE routes)
app.use(cors()); // Allows frontend to communicate with backend
app.use(express.json()); // Parses JSON data from frontend (fixes the req.body error)
app.use(express.static(path.join(__dirname, '../frontend')));

// 2. IMPORT ROUTES
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const dataRoutes = require('./routes/dataRoutes');

// 3. USE ROUTES
app.use('/api/auth', authRoutes);     // Handles Login/Signup
app.use('/api/admin', adminRoutes);   // Handles Admin creation/deletion
app.use('/api/data', dataRoutes);     // Handles fetching data for members

// 4. CONNECT TO DATABASE
mongoose.connect("mongodb://127.0.0.1:27017/CUET_Computer_Club")
  .then(() => console.log("DB connected"))
  .catch(err => console.log(err));

// 5. DEFAULT ROUTE
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// 6. START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});