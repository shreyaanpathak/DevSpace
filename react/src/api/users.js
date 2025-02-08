import { api } from './config';

export const usersApi = {
  // Get user by ID
  getUserById: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user');
    }
  },

  // Get user stats
  getUserStats: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/stats`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user stats');
    }
  },

  // Get user projects
  getUserProjects: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/projects`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user projects');
    }
  },

  // Get user activities
  getUserActivities: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/activities`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user activities');
    }
  }
};