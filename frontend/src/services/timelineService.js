import api from './api';

const timelineService = {
  getTimeline: async () => {
    try {
      const response = await api.get('/timeline/');
      return response.data;
    } catch (error) {
      console.error('Error fetching timeline:', error);
      throw error;
    }
  },
  
  getEventDetails: async (eventId) => {
    try {
      const response = await api.get(`/timeline/${eventId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching event details:', error);
      throw error;
    }
  }
};

export default timelineService;
