import api from './api';

const getNotifications = async (params = {}) => {
  const queryParams = new URLSearchParams();
  
  if (params.search) queryParams.append('search', params.search);
  if (params.ordering) queryParams.append('ordering', params.ordering);
  if (params.type && params.type !== 'all') queryParams.append('type__icontains', params.type);
  if (params.status) {
    if (params.status === 'unread') queryParams.append('is_read', 'False');
    if (params.status === 'read') queryParams.append('is_read', 'True');
  }
  if (params.page) queryParams.append('page', params.page);

  const queryString = queryParams.toString();
  const endpoint = queryString ? `/notifications/?${queryString}` : '/notifications/';
  
  const response = await api.get(endpoint);
  return response.data;
};

const getNotificationById = async (id) => {
  const response = await api.get(`/notifications/${id}/`);
  return response.data;
};

const markAsRead = async (id) => {
  const response = await api.patch(`/notifications/${id}/read/`);
  return response.data;
};

const markAllAsRead = async () => {
  const response = await api.patch(`/notifications/mark-all-read/`);
  return response.data;
};

const deleteRead = async () => {
  const response = await api.delete(`/notifications/delete-read/`);
  return response.data;
};

const notificationService = {
  getNotifications,
  getNotificationById,
  markAsRead,
  markAllAsRead,
  deleteRead,
};

export default notificationService;
