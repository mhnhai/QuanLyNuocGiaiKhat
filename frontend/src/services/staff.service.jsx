import axios from 'axios';

const API_URL = 'http://localhost:8000/api/staffs';

class StaffService {
    async getAll() {
        try {
            const response = await axios.get(API_URL);
            return response;
        } catch (error) {
            console.error('Error fetching staffs:', error);
            throw error;
        }
    }

    async checkRegistered(username) {
        try {
            const response = await axios.get(`${API_URL}/check-registered?username=${username}`);
            return response.data.registered;
        } catch (error) {
            console.error('Error checking if staff is registered:', error);  
            throw error;
        }
    }

    async getStaffName(staffId){
        try {
            const response = await axios.get(`${API_URL}/${staffId}/name`);
            return response.data.name;
        } catch (error) {
            console.error(`Error fetching staff with id ${staffId}:`, error);
            throw error;
        }
    }

    async getById(staffId) {
        try {
            const response = await axios.get(`${API_URL}/${staffId}`);
            return response;
        } catch (error) {
            console.error(`Error fetching staff with id ${staffId}:`, error);
            throw error;
        }
    }

    async create(staffData) {
        try {
            const response = await axios.post(API_URL, staffData);
            return response;
        } catch (error) {
            console.error('Error creating staff:', error);
            throw error;
        }
    }

    async update(staffId, staffData) {
        try {
            const response = await axios.put(`${API_URL}/${staffId}`, staffData);
            return response;
        } catch (error) {
            console.error(`Error updating staff with id ${staffId}:`, error);
            throw error;
        }
    }

    async delete(staffId) {
        try {
            const response = await axios.delete(`${API_URL}/${staffId}`);
            return response;
        } catch (error) {
            console.error(`Error deleting staff with id ${staffId}:`, error);
            throw error;
        }
    }

    async deleteAll() {
        try {
            const response = await axios.delete(API_URL);
            return response;
        } catch (error) {
            console.error('Error deleting all staffs:', error);
            throw error;
        }
    }
}

export default new StaffService();