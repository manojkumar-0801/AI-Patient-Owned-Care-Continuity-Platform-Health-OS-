import api from './api';

const recordService = {
  /**
   * Get all medical documents for the patient
   * @param {Object} params - Optional query params like { category: 'LAB_REPORT' }
   */
  getDocuments: async (params = {}) => {
    const response = await api.get('/records/documents/', { params });
    // Handle DRF pagination response gracefully
    return {
      success: true,
      data: response.data.results || response.data,
      count: response.data.count || (response.data.results ? response.data.results.length : response.data.length),
      next: response.data.next,
      previous: response.data.previous
    };
  },

  /**
   * Get a single medical document by ID
   * @param {string} id - Document UUID
   */
  getDocument: async (id) => {
    const response = await api.get(`/records/documents/${id}/`);
    return {
      success: true,
      data: response.data
    };
  },

  /**
   * Upload a new medical document
   * @param {FormData} formData - Multipart form data containing the file and metadata
   */
  uploadDocument: async (formData) => {
    const response = await api.post('/records/documents/', formData);
    return response.data;
  },

  /**
   * Update an existing medical document's metadata
   * @param {string} id - Document UUID
   * @param {Object} data - Metadata to update
   */
  updateDocument: async (id, data) => {
    const response = await api.patch(`/records/documents/${id}/`, data);
    return {
      success: true,
      data: response.data
    };
  },

  /**
   * Soft delete a medical document
   * @param {string} id - Document UUID
   */
  deleteDocument: async (id) => {
    const response = await api.delete(`/records/documents/${id}/`);
    return response.data;
  },

  /**
   * Get download URL for a medical document
   * @param {string} id - Document UUID
   */
  downloadDocument: async (id) => {
    const response = await api.get(`/records/documents/${id}/download/`);
    return response.data;
  }
};

export default recordService;
