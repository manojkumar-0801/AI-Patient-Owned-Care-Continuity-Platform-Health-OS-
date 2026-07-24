import api from './api';

const doctorService = {
  // Get the authenticated doctor's profile
  getProfile: async () => {
    const response = await api.get('/doctors/profile/');
    return response.data;
  },

  // Update the authenticated doctor's profile
  updateProfile: async (data) => {
    const response = await api.patch('/doctors/profile/', data);
    return response.data;
  },

  // Get patients assigned to the doctor
  getPatients: async (params = {}) => {
    // Convert params object to query string
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.status) query.append('status', params.status);
    if (params.gender) query.append('gender', params.gender);
    if (params.sort) query.append('sort', params.sort);
    if (params.page) query.append('page', params.page);
    
    const queryString = query.toString();
    const url = `/doctors/patients/${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get(url);
    return response.data;
  },

  // Get details of a single patient assigned to the doctor
  getPatientDetails: async (id) => {
    const response = await api.get(`/doctors/patients/${id}/`);
    return response.data;
  },

  // Get details of a single medical record assigned to the doctor
  getMedicalRecord: async (id) => {
    const response = await api.get(`/doctors/records/${id}/`);
    return response.data;
  },

  // Notes
  getPatientNotes: async (patientId) => {
    const response = await api.get(`/doctors/notes/?patient_id=${patientId}`);
    return response.data;
  },

  createNote: async (data) => {
    const response = await api.post('/doctors/notes/', data);
    return response.data;
  },

  getNote: async (id) => {
    const response = await api.get(`/doctors/notes/${id}/`);
    return response.data;
  },

  updateNote: async (id, data) => {
    const response = await api.patch(`/doctors/notes/${id}/`, data);
    return response.data;
  },

  deleteNote: async (id) => {
    const response = await api.delete(`/doctors/notes/${id}/`);
    return response.data;
  },

  // Stub for getting appointments
  getAppointments: async () => {
    // const response = await api.get('/doctors/appointments/');
    // return response.data;
    return { success: true, data: [] };
  }
};

export default doctorService;
