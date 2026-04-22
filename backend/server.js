const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path'); // <-- এই লাইনটি নতুন যোগ করুন


const app = express();

// ... top of server.js (imports, express setup) ...

// Routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const dataRoutes = require('./routes/dataRoutes');

app.use('/api/auth', authRoutes);     // Handles Login/Signup
app.use('/api/admin', adminRoutes);   // Handles Admin creation/deletion
app.use('/api/data', dataRoutes);     // Handles fetching data for members

// ... bottom of server.js (mongoose connect, app.listen) ...

// Middleware
app.use(cors()); // Allows frontend to communicate with backend
app.use(express.json()); // Parses JSON data from frontend
app.use(express.static(path.join(__dirname, '../frontend')));


// Routes
app.use('/api/auth', authRoutes);

app.use('/api/admin',require('./routes/adminRoutes'));

// Connect to Database

mongoose.connect("mongodb://127.0.0.1:27017/CUET_Computer_Club")
  .then(() => console.log("DB connected"))
  .catch(err => console.log(err));

//default route
// 
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});