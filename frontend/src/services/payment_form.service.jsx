import axios from 'axios';

const API_URL = 'http://localhost:8000/api/payment_forms';

const getPaymentForms = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching get payment forms:', error);
        throw error;
    }
};

export default {
    getPaymentForms,
};