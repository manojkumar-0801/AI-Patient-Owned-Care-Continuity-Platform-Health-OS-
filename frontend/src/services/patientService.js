import api from './api';

const patientService = {
  /**
   * Fetch the comprehensive user profile (includes Age, Blood Type, Allergies, etc.)
   */
  getMe: async () => {
    const response = await api.get('/auth/me/');
    return response.data;
  },

  /**
   * Fetch patient-specific profile (Insurance, Consent, etc.)
   */
  getPatientProfile: async () => {
    const response = await api.get('/patients/profile/');
    return response.data;
  },
  
  /**
   * Fetch patient health metrics
   */
  getHealthMetrics: async (params = {}) => {
    const response = await api.get('/patients/metrics/', { params });
    return response.data;
  },

  /**
   * Update the comprehensive user profile (Demographics, etc.)
   */
  updateMe: async (data) => {
    const response = await api.patch('/auth/me/', data);
    return response.data;
  },

  /**
   * Upload profile photo
   */
  uploadProfilePhoto: async (file) => {
    const formData = new FormData();
    formData.append('profile_photo', file);
    
    // Axios automatically sets multipart/form-data when passing FormData
    const response = await api.patch('/auth/me/', formData);
    return response.data;
  },

  /**
   * Update patient-specific profile (Insurance, Consent, etc.)
   */
  updatePatientProfile: async (data) => {
    const response = await api.patch('/patients/profile/', data);
    return response.data;
  }
};

export default patientService;
