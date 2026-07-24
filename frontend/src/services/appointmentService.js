import api from './api';

const appointmentService = {
  /**
   * Fetch all available doctors for booking.
   * @returns {Promise<Array>} List of doctors { id, full_name, specialization }
  */
  getAvailableDoctors: async () => {
    const response = await api.get('/appointments/available-doctors/');
    return response.data;
  },

  /**
   * Fetch all appointments for the current user (patient or doctor).
   * @param {Object} [filters={}] - Optional filters (e.g., { status: 'REQUESTED' })
   * @returns {Promise<Array>} List of appointments
   */
  getAppointments: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const url = params ? `/appointments/?${params}` : '/appointments/';
    const response = await api.get(url);
    return response.data.results || response.data;
  },

  /**
   * Fetch appointment statistics.
   * @returns {Promise<Object>} Statistics object (total, requested, etc.)
   */
  getAppointmentStats: async () => {
    const response = await api.get('/appointments/stats/');
    return response.data;
  },

  /**
   * Fetch details of a specific appointment.
   * @param {string} id - Appointment ID
   * @returns {Promise<Object>} Appointment details
   */
  getAppointmentDetails: async (id) => {
    const response = await api.get(`/appointments/${id}/`);
    return response.data;
  },

  /**
   * Book a new appointment.
   * @param {Object} data - Appointment data (doctor, scheduled_at, reason)
   * @returns {Promise<Object>} Created appointment details
  */
  bookAppointment: async (data) => {
    const response = await api.post('/appointments/', data);
    return response.data;
  },

  /**
   * Update the status of an appointment.
   * @param {string} id - Appointment ID
   * @param {string} status - New status (e.g., CONFIRMED, COMPLETED, CANCELLED)
   * @param {Object} [additionalData] - Additional data like notes
   * @returns {Promise<Object>} Updated appointment details
   */
  updateStatus: async (id, status, additionalData = {}) => {
    const response = await api.patch(`/appointments/${id}/status/`, {
      status,
      ...additionalData
    });
    return response.data;
  }
};

export default appointmentService;
