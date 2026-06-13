import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_KEY || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Simulation Endpoints
  startSimulation: async () => {
    const response = await apiClient.post('/simulate/start');
    return response.data;
  },
  getSimulationState: async (id: string) => {
    const response = await apiClient.get(`/simulate/state/${id}`);
    return response.data;
  },

  // ML Prediction Endpoints
  predictDelay: async (data: any) => {
    const response = await apiClient.post('/predict/delay', data);
    return response.data;
  },
  predictSatisfaction: async (data: any) => {
    const response = await apiClient.post('/predict/satisfaction', data);
    return response.data;
  },

  // What-If Endpoints
  runWhatIf: async (params: any) => {
    const response = await apiClient.post('/whatif/run', params);
    return response.data;
  },

  // Repo Stats
  getRepoStats: async () => {
    const response = await apiClient.get('/repo/stats');
    return response.data;
  }
};
