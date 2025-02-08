import axios from 'axios';
export const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    withCredentials: true
  });

// Common headers for API requests
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

// Helper function to handle API responses
export async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }
  return response.json();
}