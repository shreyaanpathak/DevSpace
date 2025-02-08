import { api } from '../api/config';

export const checkSession = async () => {
  try {
    const response = await api.get("/auth/check-session");
    console.log('Check session response:', response.data);
    return response.data?.user || null;
  } catch (error) {
    console.error("Session check error:", error);
    return null;
  }
};

export const profile = async (userId) => {
  try {
    console.log('Fetching profile for userId:', userId);
    const response = await api.get(`/auth/profile/${userId}`);
    console.log('Profile response:', response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    throw error;
  }
};

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
