import axios from 'axios';

const API_URL = 'http://localhost:8000/api/orders';

class OrderService {
    async getOrderCount(year, month, day){
        try {
            let params = {};
            if (year) params.year = year;   
            if (month) params.month = month;
            if (day) params.day = day;
            const response = await axios.get(`${API_URL}/count`, { params });
            return response;
        } catch (error) {
            console.error('Error fetching order count:', error);
            throw error;
        }
    }

    async getAll() {
        try {
            const response = await axios.get(API_URL);
            return response;
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw error;
        }
    }

    async getById(orderId) {
        try {
            const response = await axios.get(`${API_URL}/${orderId}`);
            return response;
        } catch (error) {
            console.error(`Error fetching order with id ${orderId}:`, error);
            throw error;
        }
    }

    async create(orderData) {
        try {
            const response = await axios.post(API_URL, orderData);
            return response;
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    }

    async update(orderId, orderData) {
        try {
            const response = await axios.put(`${API_URL}/${orderId}`, orderData);
            return response;
        } catch (error) {
            console.error(`Error updating order with id ${orderId}:`, error);
            throw error;
        }
    }

    async delete(orderId) {
        try {
            const response = await axios.delete(`${API_URL}/${orderId}`);
            return response;
        } catch (error) {
            console.error(`Error deleting order with id ${orderId}:`, error);
            throw error;
        }
    }

    async deleteAll() {
        try {
            const response = await axios.delete(API_URL);
            return response.data;
        } catch (error) {
            console.error('Error deleting all orders:', error);
            throw error;
        }
    }
}

export default new OrderService();