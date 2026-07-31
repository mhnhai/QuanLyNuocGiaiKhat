import axios from 'axios';

const API_URL = 'http://localhost:8000/api/upload-image';

const uploadImage = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        // Note: We're sending the FormData directly, not wrapping it in an object
        const response = await axios.post(API_URL, formData, {
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

const getImageUrl = (filename) => {
    return `http://localhost:8000/api/upload-image/${filename}`;
};

export default {
    uploadImage,
    getImageUrl,
};