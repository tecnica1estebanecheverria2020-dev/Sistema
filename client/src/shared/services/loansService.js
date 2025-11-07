import axios from '../api/axios';

export const loansService = {
  getLoans: async (params = {}) => {
    const response = await axios.get(`/loans`, { params });
    return response.data;
  },

  getLoanById: async (id) => {
    const response = await axios.get(`/loans/${id}`);
    return response.data;
  },

  getMyLoans: async () => {
    const response = await axios.get(`/loans/my-loans`);
    return response.data;
  },

  getLoansStats: async () => {
    const response = await axios.get(`/loans/stats`);
    return response.data;
  },

  createLoan: async ({ id_inventory, quantity, applicant, observations_loan }) => {
    const response = await axios.post(`/loans`, {
      id_inventory,
      quantity,
      applicant,
      observations_loan,
    });
    return response.data;
  },

  updateLoan: async (id, { applicant, observations_loan }) => {
    const response = await axios.put(`/loans/${id}`, { applicant, observations_loan });
    return response.data;
  },

  returnLoan: async (id, { observations_return }) => {
    const response = await axios.patch(`/loans/${id}/return`, { observations_return });
    return response.data;
  },

  deleteLoan: async (id) => {
    const response = await axios.delete(`/loans/${id}`);
    return response.data;
  },
};