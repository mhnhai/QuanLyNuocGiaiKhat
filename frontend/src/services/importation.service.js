import axios from 'axios';

const API_URL = 'http://localhost:8000/api/importations';

class ImportationService {
    async getAll() {
        try {
            const response = await axios.get(API_URL);
            return response;
        } catch (error) {
            console.error('Error fetching importations:', error);
            throw error;
        }
    }

    async getById(importationId) {
        try {
            const response = await axios.get(`${API_URL}/${importationId}`);
            return response;
        } catch (error) {
            console.error(`Error fetching importation with id ${importationId}:`, error);
            throw error;
        }
    }

    async create(importationData) {
        try {
            const response = await axios.post(API_URL, importationData);
            return response;
        } catch (error) {
            console.error('Error creating importation:', error);
            throw error;
        }
    }

    async update(importationId, importationData) {
        try {
            const response = await axios.put(`${API_URL}/${importationId}`, importationData);
            return response;
        } catch (error) {
            console.error(`Error updating importation with id ${importationId}:`, error);
            throw error;
        }
    }

    async delete(importationId) {
        try {
            const response = await axios.delete(`${API_URL}/${importationId}`);
            return response;
        } catch (error) {
            console.error(`Error deleting importation with id ${importationId}:`, error);
            throw error;
        }
    }

    async deleteAll() {
        try {
            const response = await axios.delete(API_URL);
            return response;
        } catch (error) {
            console.error('Error deleting all importations:', error);
            throw error;
        }
    }
}

export default new ImportationService();