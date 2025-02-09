import { api } from "./config";

export const filesApi = {
  getFileById: async (fileId) => {
    try {
      const response = await api.get(`/files/${fileId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching file:", error);
      throw error;
    }
  },

  getFilesByRepository: async (repoId) => {
    try {
      const response = await api.get(`/files/repositories/${repoId}/files`);
      return response.data;
    } catch (error) {
      console.error("Error fetching repository files:", error);
      throw error;
    }
  },

  updateFile: async (fileId, fileData) => {
    if (!fileId) {
      throw new Error("FileId is required for update");
    }
    try {
      const response = await api.put(`/files/${fileId}`, fileData);
      return response.data;
    } catch (error) {
      console.error("Error updating file:", error);
      throw error;
    }
  },

  createFile: async (fileData) => {
    try {
      const response = await api.post("/files", fileData);
      return response.data;
    } catch (error) {
      console.error("Error creating file:", error);
      throw error;
    }
  },

  deleteFile: async (fileId) => {
    try {
      await api.delete(`/files/${fileId}`);
    } catch (error) {
      console.error("Error deleting file:", error);
      throw error;
    }
  },

  executeFile: async (fileId) => {
    try {
      const response = await api.post(`/files/${fileId}/execute`);
      return response.data;
    } catch (error) {
      console.error("Error executing file:", error);
      throw error;
    }
  },
};
