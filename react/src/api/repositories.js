import { api } from './config';

export const repositoriesApi = {
  getRepositoryById: async (repoId) => {
    try {
      const response = await api.get(`/repositories/${repoId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch repository');
    }
  },

  getRepositoryCollaborators: async (repoId) => {
    try {
      const response = await api.get(`/repositories/${repoId}/collaborators`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch collaborators');
    }
  },

  getAccessibleRepositories: async () => {
    try {
      const response = await api.get('/repositories/accessible');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch accessible repositories');
    }
  },

  createRepository: async (repository) => {
    try {
      const response = await api.post('/repositories', repository);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create repository');
    }
  }
};
