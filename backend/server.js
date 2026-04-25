const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();

// 1. MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// ✅ SERVE UPLOADED IMAGES STATICALLY
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 2. IMPORT ROUTES
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const dataRoutes = require('./routes/dataRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// 3. USE ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/upload', uploadRoutes);

// 4. CONNECT TO DATABASE
mongoose.connect("mongodb://127.0.0.1:27017/CUET_Computer_Club")
  .then(() => console.log("✅ DB connected"))
  .catch(err => console.log("❌ DB Error:", err));

// 5. DEFAULT ROUTE
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// 6. START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});