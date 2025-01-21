import axios from 'axios';

const API_URL = 'http://localhost:8000/api/accounts';

class AccountService {
    async getAll() {
        try {
            const response = await axios.get(API_URL);
            return response;
        } catch (error) {
            console.error('Error fetching accounts:', error);
            throw error;
        }
    }

    async getById(accountId) {
        try {
            const response = await axios.get(`${API_URL}/${accountId}`);
            return response;
        } catch (error) {
            console.error(`Error fetching account with id ${accountId}:`, error);
            throw error;
        }
    }

    async create(accountData) {
        try {
            const response = await axios.post(API_URL, accountData);
            return response;
        } catch (error) {
            console.error('Error creating account:', error);
            throw error;
        }
    }

    async update(accountId, accountData) {
        try {
            const response = await axios.put(`${API_URL}/${accountId}`, accountData);
            return response;
        } catch (error) {
            console.error(`Error updating account with id ${accountId}:`, error);
            throw error;
        }
    }

    async delete(accountId) {
        try {
            const response = await axios.delete(`${API_URL}/${accountId}`);
            return response;
        } catch (error) {
            console.error(`Error deleting account with id ${accountId}:`, error);
            throw error;
        }
    }

    async deleteAll() {
        try {
            const response = await axios.delete(API_URL);
            return response;
        } catch (error) {
            console.error('Error deleting all accounts:', error);
            throw error;
        }
    }
}

export default new AccountService();