import axios from 'axios';

const API_URL = 'http://localhost:8000/api/positions';

const getPositions = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching get position:', error);
        throw error;
    }
};

export default {
    getPositions,
};