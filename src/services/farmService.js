import { api } from './api';

export const farmService = {
  findAll: async () => {
    const response = await api.get('/farms');
    return response.data;
  },

  findOne: async (id) => {
    const response = await api.get(`/farms/${id}`);
    return response.data;
  },

  create: async (farmData) => {
    const response = await api.post('/farms', farmData);
    return response.data;
  },

  update: async (id, farmData) => {
    const response = await api.patch(`/farms/${id}`, farmData);
    return response.data;
  },

  remove: async (id) => {
    const response = await api.delete(`/farms/${id}`);
    return response.data;
  },

  getAmount: async () => {
    const response = await api.get('/farms/amount');
    return response.data;
  },

  getTotalHectares: async () => {
    const response = await api.get('/farms/total-hectares');
    return response.data; 
  },

  getChartByState: async () => {
    const response = await api.get('/farms/chart-by-state');
    return response.data;
  },

  getChartByCrop: async () => {
    const response = await api.get('/farms/chart-by-crop');
    return response.data;
  },

  getChartByLandUse: async () => {
    const response = await api.get('/farms/chart-by-land-use');
    return response.data;
  },
};
