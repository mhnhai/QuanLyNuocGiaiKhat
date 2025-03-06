import axios from 'axios';

const API_URL = 'http://localhost:8000/api/revenue';

const getRevenue = async (period, value) => {
    try {
        const response = await axios.get(API_URL, {
            params: { period, value }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching revenue:', error);
        throw error;
    }
};

export default {
    getRevenue,
};