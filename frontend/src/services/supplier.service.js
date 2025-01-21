import axios from 'axios';

const API_URL = 'http://localhost:8000/api/suppliers';

class SupplierService {
    async getAll() {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            console.error('Error fetching suppliers:', error);
            throw error;
        }
    }

    async getById(supplierId) {
        try {
            const response = await axios.get(`${API_URL}/${supplierId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching supplier with id ${supplierId}:`, error);
            throw error;
        }
    }

    async create(supplierData) {
        try {
            const response = await axios.post(API_URL, supplierData);
            return response.data;
        } catch (error) {
            console.error('Error creating supplier:', error);
            throw error;
        }
    }

    async update(supplierId, supplierData) {
        try {
            const response = await axios.put(`${API_URL}/${supplierId}`, supplierData);
            return response.data;
        } catch (error) {
            console.error(`Error updating supplier with id ${supplierId}:`, error);
            throw error;
        }
    }

    async delete(supplierId) {
        try {
            const response = await axios.delete(`${API_URL}/${supplierId}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting supplier with id ${supplierId}:`, error);
            throw error;
        }
    }

    async deleteAll() {
        try {
            const response = await axios.delete(API_URL);
            return response.data;
        } catch (error) {
            console.error('Error deleting all suppliers:', error);
            throw error;
        }
    }
}

export default new SupplierService();