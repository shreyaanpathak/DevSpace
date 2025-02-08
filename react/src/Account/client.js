import { api } from '../api/config';

export const signin = async (credentials) => {
  try {
    const response = await api.post("/auth/signin", credentials);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.detail || "Login failed");
    }
    throw new Error("Network error occurred");
  }
};

export const signout = async () => {
  try {
    const response = await api.get("/auth/signout");
    return response.data;
  } catch (error) {
    console.error("Signout error:", error);
    throw error;
  }
};

export const checkSession = async () => {
  try {
    const response = await api.get("/auth/check-session");
    return response.data;
  } catch (error) {
    return null;
  }
};

export const profile = async (userId) => {
  try {
    const response = await api.get(`/auth/profile/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    throw error;
  }
};

export const updateProfile = async (userId, updatedData) => {
  try {
    const response = await api.put(`/auth/profile/${userId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Failed to update profile:", error);
    throw error;
  }
};

export const uploadProfileImage = async (userId, file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post(`/auth/profile/${userId}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to upload image:", error);
    throw error;
  }
};

export const getUsers = async (page = 1, search) => {
  try {
    const skip = (page - 1) * 20;
    const params = new URLSearchParams({
      skip: skip.toString(),
      limit: '20'
    });
    if (search) params.append('search', search);
    
    const response = await api.get(`/auth/users?${params}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw error;
  }
};

export const updateProfilePicture = async (userId, imageUrl) => {
  try {
    const response = await api.put(`/auth/profile/${userId}/update-picture`, {
      profile_picture: imageUrl
    });
    return response.data;
  } catch (error) {
    console.error('Failed to update profile picture:', error);
    throw error;
  }
};