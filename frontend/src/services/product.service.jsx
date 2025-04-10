import axios from 'axios';

const API_URL = 'http://localhost:8000/api/products';

class ProductService {
    async getProductCount(){
        try {
            const response = await axios.get(`${API_URL}/count`);
            return response.data;
        } catch (error) {
            console.error('Error fetching product count:', error);
            throw error;
        }
    }

    async getProductBySupplier(supplierId) {
        try {
            const response = await axios.get(`${API_URL}/supplier/${supplierId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching products by supplier:', error);
            throw error;
        }
    }

    async getAll(sort_by, order) {
        try {
            const response = await axios.get(API_URL, { params: { sort_by, order } });
            return response;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    }

    async getById(productId) {
        try {
            const response = await axios.get(`${API_URL}/${productId}`);
            return response;
        } catch (error) {
            console.error(`Error fetching product with id ${productId}:`, error);
            throw error;
        }
    }

    async create(productData) {
        try {
            const response = await axios.post(API_URL, productData);
            return response;
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    }

    async update(productId, productData) {
        try {
            const response = await axios.put(`${API_URL}/${productId}`, productData);
            return response;
        } catch (error) {
            console.error(`Error updating product with id ${productId}:`, error);
            throw error;
        }
    }

    async delete(productId) {
        try {
            const response = await axios.delete(`${API_URL}/${productId}`);
            return response;
        } catch (error) {
            console.error(`Error deleting product with id ${productId}:`, error);
            throw error;
        }
    }

    async deleteAll() {
        try {
            const response = await axios.delete(API_URL);
            return response;
        } catch (error) {
            console.error('Error deleting all products:', error);
            throw error;
        }
    }


}

export default new ProductService();