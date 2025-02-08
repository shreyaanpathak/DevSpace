import { api } from './config';

export const filesApi = {
  // Get file by ID
  getFileById: async (fileId) => {
    try {
      const response = await api.get(`/files/${fileId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch file');
    }
  },

  // Get files by repository ID
  getFilesByRepository: async (repoId) => {
    try {
      const response = await api.get(`/repositories/${repoId}/files`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch repository files');
    }
  },

  // Create new file
  createFile: async (fileData) => {
    try {
      const response = await api.post('/files', fileData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create file');
    }
  },

  // Update file content
  updateFile: async (fileId, content) => {
    try {
      const response = await api.put(`/files/${fileId}`, { content });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update file');
    }
  }
};