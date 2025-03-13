import axios from 'axios';

const API_URL = 'http://localhost:8000/api/upload-image';
const apiClient = axios.create({
    baseURL: 'http://localhost:8000',  // URL của FastAPI server
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });
  export const uploadService = {
    // Upload ảnh mới (và xóa ảnh cũ nếu có)
    uploadImage: async (file, oldFilename = null) => {
      const formData = new FormData();
      formData.append('file', file);
      
      if (oldFilename) {
        formData.append('old_filename', oldFilename);
      }
      
      try {
        const response = await apiClient.post('/upload-image', formData);
        return response.data;
      } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
      }
    },
    
    // Lấy đường dẫn của ảnh
    getImageUrl: (filename) => {
      if (!filename) return null;
      return `${apiClient.defaults.baseURL}/upload-image/${filename}`;
    },
    
    // Xóa ảnh
    deleteImage: async (filename) => {
      try {
        const response = await apiClient.delete(`/upload-image/${filename}`);
        return response.data;
      } catch (error) {
        console.error('Error deleting image:', error);
        throw error;
      }
    }
  };