require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');

// Import routers
const userRouters = require('./routers/userRouters');
const taskRouters = require('./routers/taskRouters');

// Initialize Express
const app = express();

// Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount routers, with base API branches
app.use('/users', userRouters);   // User APIs
app.use('/tasks', taskRouters);   // Task APIs

// Mount an Example to test if express is working 
app.get('/profile', (req, res) => {
    res.json({ message: "Profile endpoint placeholder" });
});

// Mount Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message });
});

// Connect to MongoDB and start server
async function startServer() {
    try {
        await mongoose.connect(process.env.TODO_DB_URL);
        console.log('MongoDB connected successfully');

        app.listen(process.env.PORT, () => console.log('Server running on port 3000'));
    } catch (err) {
        console.error('DB connection error:', err);
        process.exit(1);
    }
}

startServer();

module.exports = app;
