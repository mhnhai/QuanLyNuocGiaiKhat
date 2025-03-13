import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8000/api/upload-image',  // URL của FastAPI server
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });
const uploadService = {
    // Upload ảnh mới (và xóa ảnh cũ nếu có)
    uploadImage: async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const response = await apiClient.post(apiClient.defaults.baseURL, formData);
        return response.data;
      } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
      }
    },
    
    // Lấy đường dẫn của ảnh
    getImageUrl: (filename) => {
      if (!filename) return null;
      return `${apiClient.defaults.baseURL}/${filename}`;
    },
    
    // Xóa ảnh
    deleteImage: async (filename) => {
      try {
        const response = await apiClient.delete(`${apiClient.defaults.baseURL}/${filename}`);
        return response.data;
      } catch (error) {
        console.error('Error deleting image:', error);
        throw error;
      }
    }
  };

export default uploadService;