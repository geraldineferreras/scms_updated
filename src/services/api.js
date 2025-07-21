import axios from 'axios';

const API_BASE = 'http://192.168.1.254/scms_new/index.php/api';

class ApiService {
  // Helper method for making requests
  async makeRequest(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const { method = 'GET', headers = {}, body } = options;
    const config = {
      url,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };
    if (body) {
      config.data = JSON.parse(body);
    }
    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      // Axios error handling
      const message = error.response?.data?.message || error.message || 'API Error';
      console.error(`API Error (${endpoint}):`, message);
      // Token/session expiration handling
      if (
        message.toLowerCase().includes('token expired') ||
        message.toLowerCase().includes('unauthorized') ||
        error.response?.status === 401
      ) {
        // Dispatch a custom event for session timeout
        window.dispatchEvent(new CustomEvent('sessionTimeout'));
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('scms_logged_in_user');
        // Do not redirect here; let the modal handle it
        return;
      }
      throw new Error(message);
    }
  }

  // Authentication methods
  async login(email, password) {
    return this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData) {
    return this.makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    const token = localStorage.getItem('token');
    return this.makeRequest('/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // Authenticated requests
  async getProfile() {
    const token = localStorage.getItem('token');
    return this.makeRequest('/user', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async updateProfile(userData) {
    const token = localStorage.getItem('token');
    return this.makeRequest('/user', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
  }

  // Admin methods
  async getSections() {
    const token = localStorage.getItem('token');
    return this.makeRequest('/admin/sections', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async createSection(sectionData) {
    const token = localStorage.getItem('token');
    return this.makeRequest('/admin/sections', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(sectionData),
    });
  }

  // Fetch users by role
  async getUsersByRole(role) {
    const token = localStorage.getItem('token');
    return this.makeRequest(`/users?role=${role}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }
}

export default new ApiService(); 