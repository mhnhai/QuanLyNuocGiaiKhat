import axios from 'axios';

const API_URL = 'http://localhost:8000/api/statuses';

const getStatuses = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching roles:', error);
        throw error;
    }
};

export default {
    getStatuses,
};