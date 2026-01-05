import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost/newc/api', // Adjust path based on user server setup
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
