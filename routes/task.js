const express = require('express');
const Task = require('../models/Task');
const { publishToQueue } = require('../rabbitmq');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();
const axios = require('axios'); // Install axios with `npm install axios`

// Create a task
router.post('/', async (req, res) => {
    try {
        const { title, description, assignedTo, status, priority, deadline } = req.body;

        // Validate user via User Management Service
        if (assignedTo) {
            const response = await axios.get(`http://localhost:3000/api/auth/profile/${assignedTo}`);
            if (!response.data) throw new Error('Invalid assignedTo user');
        }

        const task = new Task({ title, description, assignedTo, status, priority, deadline });
        await task.save();

        // Publish event to RabbitMQ
        publishToQueue({
            eventType: 'task_created',
            taskId: task._id,
            userEmail: req.body.userEmail,
            description: task.description,
        });
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find().populate('assignedTo', 'username email');
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a specific task by ID
router.get('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate('assignedTo', 'username email');
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a task
router.put('/:id', async (req, res) => {
    try {
        const { title, description, assignedTo, status, priority, deadline } = req.body;
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { title, description, assignedTo, status, priority, deadline },
            { new: true }
        );
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a task
router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;