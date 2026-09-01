import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  timeout: 10000,
});

export const getHealth = () => api.get('/api/health');
export const getDashboard = () => api.get('/api/dashboard');
export const getIncidents = () => api.get('/api/incidents');
export const getIncidentById = (id) => api.get('/api/incidents/' + id);
export const executeSoarAction = (id, actionType) => 
  api.post('/api/incidents/' + id + '/soar-action', { action_type: actionType });
export const createIncident = (data) => api.post('/api/incidents', data);
export const updateIncidentStatus = (id, status) => 
  api.patch('/api/incidents/' + id + '/status?status=' + status);

export default api;
