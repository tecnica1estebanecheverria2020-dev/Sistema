import axios from '../api/axios';

export const schedulesService = {

  getSchedules: async (filters = {}) => {
    const response = await axios.get(`/schedules`, { params: filters });
    return response.data;
  },

 
  getScheduleById: async (id) => {
    const response = await axios.get(`/schedules/${id}`);
    return response.data;
  },


  getSchedulesByDay: async (day) => {
    const response = await axios.get(`/schedules/day/${encodeURIComponent(day)}`);
    return response.data;
  },


  getWeeklySchedule: async () => {
    const response = await axios.get(`/schedules/weekly`);
    return response.data;
  },


  getSchedulesStats: async () => {
    const response = await axios.get(`/schedules/stats`);
    return response.data;
  },

  createSchedule: async (schedule) => {
    const response = await axios.post(`/schedules`, schedule);
    return response.data;
  },

  updateSchedule: async (id, schedule) => {
    const response = await axios.put(`/schedules/${id}`, schedule);
    return response.data;
  },

  deleteSchedule: async (id) => {
    const response = await axios.delete(`/schedules/${id}`);
    return response.data;
  },
  
};