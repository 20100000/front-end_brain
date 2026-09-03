import { api } from './api';

export const farmCropsService = {
  remove: async (id) => {
    const response = await api.delete(`/farm-crops/${id}`);
    return response.data;
  },
};
