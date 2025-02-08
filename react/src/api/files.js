import { api } from './config';

export const filesApi = {
  getFileById: async (fileId) => {
    try {
      const response = await api.get(`/files/${fileId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch file');
    }
  },

  getFilesByRepository: async (repoId) => {
    try {
      const response = await api.get(`/files/repositories/${repoId}/files`)
      console.log(response)
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch repository files');
    }
  },

  uploadFile: async (fileData) => {
    try {
      const response = await api.post('/files', fileData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to upload file');
    }
  },

  updateFile: async (fileId, updatedFile) => {
    try {
      const response = await api.put(`/files/${fileId}`, updatedFile);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update file');
    }
  }
};
