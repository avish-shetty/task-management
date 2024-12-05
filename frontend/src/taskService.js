import axios from 'axios';

const API_URL = 'http://localhost:5001/api/tasks';

const getAuthHeaders = () => {
    return {
        headers: {
            Authorization: `Bearer YOUR_ACCESS_TOKEN`
        }
    };
};

export const getTasks = async () => {
    try {
        const response = await axios.get(API_URL, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error('Error fetching tasks:', error);
        throw error;
    }
};

export const getTaskById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error('Error fetching task:', error);
        throw error;
    }
};

export const createTask = async (taskData) => {
    try {
        const response = await axios.post(API_URL, taskData, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error('Error creating task:', error);
        throw error;
    }
};

export const updateTask = async (id, taskData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, taskData, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error('Error updating task:', error);
        throw error;
    }
};

export const deleteTask = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error('Error deleting task:', error);
        throw error;
    }
};