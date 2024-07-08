const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://vishwamihi22:lEhQe1J566HMBSWI@cluster0.7tfnvps.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Define a schema for schedules
const scheduleSchema = new mongoose.Schema({
    schedule: {
        type: Array,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create a model for schedules
const Schedule = mongoose.model('Schedule', scheduleSchema);

// Routes
app.get('/', (req, res) => {
    res.send('Hello, this is the Time Management App backend!');
});

// User registration route
app.post('/register', (req, res) => {
    const { username, password, email } = req.body;
    // Implement user registration logic here
    res.json({ message: 'User registered successfully!' });
});

// User login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Implement user login logic here
    res.json({ message: 'User logged in successfully!' });
});

// Save schedule route
app.post('/save-schedule', (req, res) => {
    const newSchedule = new Schedule({
        schedule: req.body.schedule
    });

    newSchedule.save()
        .then(schedule => res.json({ success: true, schedule }))
        .catch(err => res.status(400).json({ success: false, error: err.message }));
});

// Get saved schedules route
app.get('/schedules', (req, res) => {
    Schedule.find()
        .sort({ createdAt: -1 }) // Sort by newest first
        .then(schedules => res.json(schedules))
        .catch(err => res.status(400).json({ success: false, error: err.message }));
});

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
