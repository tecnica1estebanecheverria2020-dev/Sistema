import axios from '../api/axios';

export const catalogsService = {
  getClassrooms: async () => {
    const { data } = await axios.get('/catalogs/classrooms');
    return data; 
  },
  getWorkshopGroups: async () => {
    const { data } = await axios.get('/catalogs/workshop-groups');
    return data; 
  },
  getSubjects: async () => {
    const { data } = await axios.get('/catalogs/subjects');
    return data; 
  },
  getTeachers: async () => {
    const { data } = await axios.get('/catalogs/teachers');
    return data; 
  },
  getSubjectUsers: async (filters = {}) => {
    const { data } = await axios.get('/catalogs/subject-users', { params: filters });
    return data; 
  },
};