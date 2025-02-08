import axios from 'axios';

// Create main API instance
export const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    withCredentials: true
});

// Common headers for API requests
export const DEFAULT_HEADERS = {
    'Content-Type': 'application/json'
};

// Add request interceptor to apply default headers
api.interceptors.request.use(
    (config) => {
        // Merge default headers with any existing headers
        config.headers = {
            ...DEFAULT_HEADERS,
            ...config.headers
        };
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Helper function to handle API responses
export async function handleResponse(response) {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'API request failed');
    }
    return response.json();
}

// Export the axios instance and helper functions
export default api;
