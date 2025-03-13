import axios from 'axios';

const API_URL = 'http://localhost:8000/api/customers';

class CustomerService {
    async getCustomerCount(){
        try {
            const response = await axios.get(`${API_URL}/count`);
            return response.data;
        } catch (error) {
            console.error('Error fetching product count:', error);
            throw error;
        }
    }

    async getAll() {
        try {
            const response = await axios.get(API_URL);
            return response;
        } catch (error) {
            console.error('Error fetching customers:', error);
            throw error;
        }
    }

    async getById(customerId) {
        try {
            const response = await axios.get(`${API_URL}/${customerId}`);
            return response;
        } catch (error) {
            console.error(`Error fetching customer with id ${customerId}:`, error);
            throw error;
        }
    }

    async create(customerData) {
        try {
            const response = await axios.post(API_URL, customerData);
            return response;
        } catch (error) {
            console.error('Error creating customer:', error);
            throw error;
        }
    }

    async update(customerId, customerData) {
        try {
            const response = await axios.put(`${API_URL}/${customerId}`, customerData);
            return response;
        } catch (error) {
            console.error(`Error updating customer with id ${customerId}:`, error);
            throw error;
        }
    }

    async delete(customerId) {
        try {
            const response = await axios.delete(`${API_URL}/${customerId}`);
            return response;
        } catch (error) {
            console.error(`Error deleting customer with id ${customerId}:`, error);
            throw error;
        }
    }

    async deleteAll() {
        try {
            const response = await axios.delete(API_URL);
            return response;
        } catch (error) {
            console.error('Error deleting all customers:', error);
            throw error;
        }
    }
}

export default new CustomerService();