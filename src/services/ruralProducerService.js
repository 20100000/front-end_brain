import { api } from './api';

export const ruralProducerService = {
  findAll: async () => {
    const response = await api.get('/rural-producers');
    return response.data;
  },

  findOne: async (id) => {
    const response = await api.get(`/rural-producers/${id}`);
    return response.data;
  },

  create: async (producerData) => {
    const response = await api.post('/rural-producers', producerData);
    return response.data;
  },

  update: async (id, producerData) => {
    const response = await api.patch(`/rural-producers/${id}`, producerData);
    return response.data;
  },

  remove: async (id) => {
    const response = await api.delete(`/rural-producers/${id}`);
    return response.data;
  },
};
