import axios from '../../../shared/api/axios'

export const dataService = {
    fetchData: async () => {
        try {
            const response = await axios.get('/dashboard/data');
            const data = response?.data?.data || {};
            return data;
        } catch (error) {
            throw error;
        }
    },
    fetchTodayLoans: async () => {
        try {
            const resp = await axios.get('/dashboard/today-loans');
            const data = resp?.data?.loans || [];
            return data;
        } catch (error) {
            throw error;
        }
    },
    fetchActivitySummary: async () => {
        try {
            const resp = await axios.get('/dashboard/activity-summary');
            const data = resp?.data?.data || {};
            return data;
        } catch (error) {
            throw error;
        }
    }
}