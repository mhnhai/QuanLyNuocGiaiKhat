import axios from 'axios';

const API_URL = 'http://localhost:8000/api/order_details';

class OrderDetailService {
    async getAll() {
        try {
            const response = await axios.get(API_URL);
            return response;
        } catch (error) {
            console.error('Error fetching order_details:', error);
            throw error;
        }
    }

    async getById(order_detailsId) {
        try {
            const response = await axios.get(`${API_URL}/${order_detailsId}`);
            return response;
        } catch (error) {
            console.error(`Error fetching order_details with id ${order_detailsId}:`, error);
            throw error;
        }
    }

    async create(order_detailsData) {
        try {
            const response = await axios.post(API_URL, order_detailsData);
            return response;
        } catch (error) {
            console.error('Error creating order_details:', error);
            throw error;
        }
    }

    async update(order_detailsId, order_detailsData) {
        try {
            const response = await axios.put(`${API_URL}/${order_detailsId}`, order_detailsData);
            return response;
        } catch (error) {
            console.error(`Error updating order_details with id ${order_detailsId}:`, error);
            throw error;
        }
    }

    async delete(order_detailsId) {
        try {
            const response = await axios.delete(`${API_URL}/${order_detailsId}`);
            return response;
        } catch (error) {
            console.error(`Error deleting order_details with id ${order_detailsId}:`, error);
            throw error;
        }
    }

    async deleteAll() {
        try {
            const response = await axios.delete(API_URL);
            return response;
        } catch (error) {
            console.error('Error deleting all order_details:', error);
            throw error;
        }
    }
}

export default new OrderDetailService();