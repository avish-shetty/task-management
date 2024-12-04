const axios = require('axios');

const verifyToken = async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

    try {
        const response = await axios.post('http://localhost:5000/api/auth', { token });
        if (!response.data.valid) throw new Error('Invalid token');
        req.user = response.data.user;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = verifyToken;