import axios from 'axios';

const API_BASE = 'http://localhost/scms_new/index.php/api';

class ApiService {
  // Helper method to validate token presence
  validateToken() {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found. Please log in again.');
    }
    return token;
  }

  // Helper method for making requests
  async makeRequest(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const { method = 'GET', headers = {}, body, requireAuth = false } = options;
    
    // Get token from localStorage if authentication is required
    let authHeaders = { ...headers };
    if (requireAuth) {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      authHeaders['Authorization'] = `Bearer ${token}`;
    }
    
    const config = {
      url,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
    };
    
    // Handle body data properly
    if (body) {
      // Check if body is FormData
      if (body instanceof FormData) {
        config.data = body;
        // Remove Content-Type header for FormData to let browser set it with boundary
        delete config.headers['Content-Type'];
      } else {
        // Parse JSON string to object
        config.data = JSON.parse(body);
      }
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

    
    return this.makeRequest('/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async registerWithImages(formData) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found. Please log in again.');
    }
    
    try {
      const response = await axios.post(`${API_BASE}/register`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Registration failed';
      console.error('Registration with images error:', message);
      throw new Error(message);
    }
  }

  async logout() {
    return this.makeRequest('/auth/logout', {
      method: 'POST',
      requireAuth: true,
    });
  }

  // Authenticated requests
  async getProfile() {
    return this.makeRequest('/user', {
      method: 'GET',
      requireAuth: true,
    });
  }

  async updateProfile(userData) {
    return this.makeRequest('/user', {
      method: 'PUT',
      body: JSON.stringify(userData),
      requireAuth: true,
    });
  }

  // Section Management API endpoints - Individual methods for each program
  async getSectionsBSIT() {
    return this.makeRequest('/admin/sections_by_program?program=BSIT', {
      method: 'GET',
      requireAuth: true,
    });
  }

  async getSectionsBSCS() {
    return this.makeRequest('/admin/sections_by_program?program=BSCS', {
      method: 'GET',
      requireAuth: true,
    });
  }

  async getSectionsBSIS() {
    return this.makeRequest('/admin/sections_by_program?program=BSIS', {
      method: 'GET',
      requireAuth: true,
    });
  }

  async getSectionsACT() {
    return this.makeRequest('/admin/sections_by_program?program=ACT', {
      method: 'GET',
      requireAuth: true,
    });
  }

  async getSectionsByProgram(program) {
    return this.makeRequest(`/admin/sections_by_program?program=${program}`, {
      method: 'GET',
      requireAuth: true,
    });
  }

  async getSectionsByProgramAndYear(program, yearLevel) {
    return this.makeRequest(`/admin/sections_by_program_year_specific?program=${program}&year_level=${yearLevel}`, {
      method: 'GET',
      requireAuth: true,
    });
  }

  async getSectionsByCourse(course) {
    // Map course IDs to program names
    const programMap = {
      'bsit': 'BSIT',
      'bscs': 'BSCS', 
      'bsis': 'BSIS',
      'act': 'ACT'
    };
    const program = programMap[course] || 'BSIT';
    console.log(`Getting sections for course: ${course} -> program: ${program}`);
    return this.makeRequest(`/admin/sections_by_program?program=${program}`, {
      method: 'GET',
      requireAuth: true,
    });
  }
  

  async getSectionsByYear(year) {
    // Map year names to year levels
    const yearMap = {
      '1st Year': '1st',
      '2nd Year': '2nd', 
      '3rd Year': '3rd',
      '4th Year': '4th'
    };
    const yearLevel = yearMap[year] || '1st';
    return this.makeRequest(`/admin/sections_by_program_year_specific?program=BSIT&year_level=${yearLevel}`, {
      method: 'GET',
      requireAuth: true,
    });
  }

  async getSectionsByAcademicYear(academicYear) {
    // For now, return all sections since the API doesn't support academic year filtering
    return this.makeRequest('/admin/sections_by_program?program=BSIT', {
      method: 'GET',
      requireAuth: true,
    });
  }

  async getSectionsBySemester(semester) {
    // For now, return all sections since the API doesn't support semester filtering
    return this.makeRequest('/admin/sections_by_program?program=BSIT', {
      method: 'GET',
      requireAuth: true,
    });
  }

  async getSectionById(sectionId) {
    // Since there's no specific endpoint for single section, we'll get all and filter
    const allSections = await this.getSections();
    const section = allSections.data?.find(s => s.id === sectionId);
    if (!section) {
      throw new Error('Section not found');
    }
    return { success: true, data: section };
  }

  async createSection(sectionData) {
    // Note: This endpoint might not exist in your backend yet
    return this.makeRequest('/admin/sections', {
      method: 'POST',
      body: JSON.stringify(sectionData),
      requireAuth: true,
    });
  }

  async updateSection(sectionId, sectionData) {
    // Note: This endpoint might not exist in your backend yet
    return this.makeRequest(`/admin/sections/${sectionId}`, {
      method: 'PUT',
      body: JSON.stringify(sectionData),
      requireAuth: true,
    });
  }

  async deleteSection(sectionId) {
    // Note: This endpoint might not exist in your backend yet
    return this.makeRequest(`/admin/sections/${sectionId}`, {
      method: 'DELETE',
      requireAuth: true,
    });
  }

  async getSectionStudents(sectionId) {
    // Note: This endpoint might not exist in your backend yet
    return this.makeRequest(`/admin/sections/${sectionId}/students`, {
      method: 'GET',
      requireAuth: true,
    });
  }

  async addStudentToSection(sectionId, studentData) {
    // Note: This endpoint might not exist in your backend yet
    return this.makeRequest(`/admin/sections/${sectionId}/students`, {
      method: 'POST',
      body: JSON.stringify(studentData),
      requireAuth: true,
    });
  }

  async removeStudentFromSection(sectionId, studentId) {
    // Note: This endpoint might not exist in your backend yet
    return this.makeRequest(`/admin/sections/${sectionId}/students/${studentId}`, {
      method: 'DELETE',
      requireAuth: true,
    });
  }

  async getAvailableTeachers() {
    // Note: This endpoint might not exist in your backend yet
    // For now, return empty array to avoid CORS errors
    return { success: true, data: [] };
  }

  async getAvailableStudents() {
    // Note: This endpoint might not exist in your backend yet
    // For now, return empty array to avoid CORS errors
    return { success: true, data: [] };
  }

  async exportSections(format = 'csv') {
    // Note: This endpoint might not exist in your backend yet
    return this.makeRequest(`/admin/sections/export?format=${format}`, {
      method: 'GET',
      requireAuth: true,
    });
  }

  async getCourses() {
    // Return static course data since there's no API endpoint
    return {
      success: true,
      data: [
        { id: "bsit", abbr: "BSIT", name: "Info Tech" },
        { id: "bscs", abbr: "BSCS", name: "Computer Science" },
        { id: "bsis", abbr: "BSIS", name: "Info Systems" },
        { id: "act", abbr: "ACT", name: "Computer Technology" },
      ]
    };
  }

  async getAcademicYears() {
    // Return static academic years since there's no API endpoint
    return {
      success: true,
      data: [
        "2023-2024",
        "2024-2025",
        "2025-2026"
      ]
    };
  }

  async getSemesters() {
    // Return static semesters since there's no API endpoint
    return {
      success: true,
      data: [
        "1st Semester",
        "2nd Semester",
        "Summer"
      ]
    };
  }

  // Fetch users by role
  async getUsersByRole(role) {
    return this.makeRequest(`/users?role=${role}`, {
      method: 'GET',
      requireAuth: true,
    });
  }

  // Get all users (for admin)
  async getAllUsers() {
    return this.makeRequest('/users', {
      method: 'GET',
      requireAuth: true,
    });
  }

  // Update user
  async updateUser(userId, userData) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found. Please log in again.');
    }
    
    try {
      console.log('Updating user with data:', userData);
      
      const response = await axios.put(`${API_BASE}/auth/update_user`, userData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      });
      
      console.log('Update response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Full update error:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error response status:', error.response?.status);
      const message = error.response?.data?.message || error.message || 'Update failed';
      console.error('Update error:', message);
      throw new Error(message);
    }
  }

  async updateUserWithImages(userId, formData) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found. Please log in again.');
    }
    
    try {
      // Get the role from the FormData to determine the correct endpoint
      const role = formData.get('role');
      console.log('Updating user with role:', role);
      
      console.log('Using endpoint:', `${API_BASE}/auth/update_user`);
      
      // Log FormData contents for debugging
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value instanceof File ? `File: ${value.name}` : value);
      }
      
      const response = await axios.put(`${API_BASE}/auth/update_user`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 second timeout
      });
      
      console.log('Update response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Full error object:', error);
      console.error('Error response:', error.response);
      console.error('Error request:', error.request);
      
      let message = 'Update failed';
      if (error.response) {
        // Server responded with error status
        message = error.response.data?.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Request was made but no response received
        message = 'Network error - no response from server';
      } else {
        // Something else happened
        message = error.message || 'Unknown error occurred';
      }
      
      console.error('Update user with images error:', message);
      throw new Error(message);
    }
  }

  // Role-specific update methods
  async updateAdminUser(formData) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found. Please log in again.');
    }
    
    try {
      // Check if there are files in the FormData
      let hasFiles = false;
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          hasFiles = true;
          break;
        }
      }
      
      let response;
      if (hasFiles) {
        // Send as multipart/form-data using POST
        response = await axios.post(`${API_BASE}/admin/update`, formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000,
        });
      } else {
        // Convert FormData to JSON and send using PUT
        const jsonData = {};
        for (let [key, value] of formData.entries()) {
          jsonData[key] = value;
        }
        
        response = await axios.put(`${API_BASE}/admin/update`, jsonData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        });
      }
      
      return response.data;
    } catch (error) {
      console.error('Full admin update error:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error response status:', error.response?.status);
      const message = error.response?.data?.message || error.message || 'Admin update failed';
      console.error('Admin update error:', message);
      throw new Error(message);
    }
  }

  async updateTeacherUser(formData) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found. Please log in again.');
    }
    
    try {
      // Check if there are files in the FormData
      let hasFiles = false;
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          hasFiles = true;
          break;
        }
      }
      
      let response;
      if (hasFiles) {
        // Send as multipart/form-data using POST
        response = await axios.post(`${API_BASE}/teacher/update`, formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000,
        });
      } else {
        // Convert FormData to JSON and send using PUT
        const jsonData = {};
        for (let [key, value] of formData.entries()) {
          jsonData[key] = value;
        }
        
        response = await axios.put(`${API_BASE}/teacher/update`, jsonData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        });
      }
      
      return response.data;
    } catch (error) {
      console.error('Full teacher update error:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error response status:', error.response?.status);
      const message = error.response?.data?.message || error.message || 'Teacher update failed';
      console.error('Teacher update error:', message);
      throw new Error(message);
    }
  }

  async updateStudentUser(formData) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found. Please log in again.');
    }
    
    try {
      // Check if there are files in the FormData
      let hasFiles = false;
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          hasFiles = true;
          break;
        }
      }
      
      let response;
      if (hasFiles) {
        // Send as multipart/form-data using POST
        response = await axios.post(`${API_BASE}/student/update`, formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000,
        });
      } else {
        // Convert FormData to JSON and send using PUT
        const jsonData = {};
        for (let [key, value] of formData.entries()) {
          jsonData[key] = value;
        }
        
        response = await axios.put(`${API_BASE}/student/update`, jsonData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        });
      }
      
      return response.data;
    } catch (error) {
      console.error('Full student update error:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error response status:', error.response?.status);
      const message = error.response?.data?.message || error.message || 'Student update failed';
      console.error('Student update error:', message);
      throw new Error(message);
    }
  }

  async fetchUserByRoleAndId(role, userId) {
    return this.makeRequest(`/user?role=${role}&user_id=${userId}`, {
      method: 'GET',
      requireAuth: true,
    });
  }

  async getUserById(userId, role) {
    try {
      // Use makeRequest with requireAuth
      const response = await this.makeRequest(`/user?role=${role}&user_id=${userId}`, {
        method: 'GET',
        requireAuth: true,
      });
      return response;
    } catch (error) {
      // If makeRequest fails, try direct axios call as fallback
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      try {
        const response = await axios.get(`${API_BASE}/user?role=${role}&user_id=${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000, // 10 second timeout
        });

        return response.data;
      } catch (axiosError) {
        console.error("Direct axios call failed:", axiosError);
        throw axiosError;
      }
    }
  }

  // Delete user
  async deleteUser(userId) {
    return this.makeRequest(`/users/${userId}`, {
      method: 'DELETE',
      requireAuth: true,
    });
  }

  // Image upload methods
  async uploadProfileImage(file) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found. Please log in again.');
    }
    
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const response = await axios.post(`${API_BASE}/upload/profile`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Upload failed';
      console.error('Profile image upload error:', message);
      throw new Error(message);
    }
  }

  async uploadCoverPhoto(file) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found. Please log in again.');
    }
    
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const response = await axios.post(`${API_BASE}/upload/cover`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Upload failed';
      console.error('Cover photo upload error:', message);
      throw new Error(message);
    }
  }

  async getTeachers() {
    return this.makeRequest('/users?role=teacher', {
      method: 'GET',
      requireAuth: true,
    });
  }

  async getStudents() {
    return this.makeRequest('/users?role=student', {
      method: 'GET',
      requireAuth: true,
    });
  }

  // Role-specific delete methods
  async deleteAdminUser(userId) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found. Please log in again.');
    }
    
    try {
      const response = await axios.delete(`${API_BASE}/admin/delete`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: { 
          user_id: userId,
          role: 'admin'
        },
        timeout: 30000,
      });
      
      return response.data;
    } catch (error) {
      console.error('Full admin delete error:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error response status:', error.response?.status);
      const message = error.response?.data?.message || error.message || 'Admin delete failed';
      console.error('Admin delete error:', message);
      throw new Error(message);
    }
  }

  async deleteTeacherUser(userId) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found. Please log in again.');
    }
    
    try {
      const response = await axios.delete(`${API_BASE}/teacher/delete`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: { 
          user_id: userId,
          role: 'teacher'
        },
        timeout: 30000,
      });
      
      return response.data;
    } catch (error) {
      console.error('Full teacher delete error:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error response status:', error.response?.status);
      const message = error.response?.data?.message || error.message || 'Teacher delete failed';
      console.error('Teacher delete error:', message);
      throw new Error(message);
    }
  }

  async deleteStudentUser(userId) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found. Please log in again.');
    }
    
    try {
      const response = await axios.delete(`${API_BASE}/student/delete`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: { 
          user_id: userId,
          role: 'student'
        },
        timeout: 30000,
      });
      
      return response.data;
    } catch (error) {
      console.error('Full student delete error:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error response status:', error.response?.status);
      const message = error.response?.data?.message || error.message || 'Student delete failed';
      console.error('Student delete error:', message);
      throw new Error(message);
    }
  }
}

export default new ApiService(); 