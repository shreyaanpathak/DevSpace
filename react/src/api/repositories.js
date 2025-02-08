import { api } from './config';

export const repositoriesApi = {
  // Get repository by ID
  getRepositoryById: async (repoId) => {
    try {
      const response = await api.get(`/repositories/${repoId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch repository');
    }
  },

  // Get repository collaborators
  getRepositoryCollaborators: async (repoId) => {
    try {
      const response = await api.get(`/repositories/${repoId}/collaborators`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch repository collaborators');
    }
  },

  // Create new repository
  createRepository: async (repositoryData) => {
    try {
      const response = await api.post('/repositories', repositoryData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create repository');
    }
  }
};