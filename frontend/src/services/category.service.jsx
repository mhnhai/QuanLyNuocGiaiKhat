import axios from 'axios';

const API_URL = 'http://localhost:8000/api/categories';

const getCategories = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching get categories:', error);
        throw error;
    }
};
    
export default {
    getCategories,
};