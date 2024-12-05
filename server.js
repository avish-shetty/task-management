const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const { connectRabbitMQ, publishToQueue } = require('./rabbitmq');
const Task = require('./models/Task');
dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch((error) => console.error('Database connection error:', error));


// RabbitMQ Connection
// connectRabbitMQ();

// Routes
const taskRoutes = require('./routes/task');
app.use('/api/tasks', taskRoutes);

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});