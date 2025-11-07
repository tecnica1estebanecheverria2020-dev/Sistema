import handleError from '../utils/handleError.js';

export default class CatalogsController {
  constructor(service) {
    this.service = service;
    this.getClassrooms = this.getClassrooms.bind(this);
    this.getWorkshopGroups = this.getWorkshopGroups.bind(this);
    this.getSubjects = this.getSubjects.bind(this);
    this.getTeachers = this.getTeachers.bind(this);
    this.getSubjectUsers = this.getSubjectUsers.bind(this);
  }

  async getClassrooms(req, res) {
    try {
      const rows = await this.service.getClassrooms();
      res.json(rows);
    } catch (err) { handleError(err, res); }
  }

  async getWorkshopGroups(req, res) {
    try {
      const rows = await this.service.getWorkshopGroups();
      res.json(rows);
    } catch (err) { handleError(err, res); }
  }

  async getSubjects(req, res) {
    try {
      const rows = await this.service.getSubjects();
      res.json(rows);
    } catch (err) { handleError(err, res); }
  }

  async getTeachers(req, res) {
    try {
      const rows = await this.service.getTeachers();
      res.json(rows);
    } catch (err) { handleError(err, res); }
  }

  async getSubjectUsers(req, res) {
    try {
      const { teacher_id, subject_id } = req.query;
      const rows = await this.service.getSubjectUsers({
        teacher_id: teacher_id ? parseInt(teacher_id, 10) : null,
        subject_id: subject_id ? parseInt(subject_id, 10) : null,
      });
      res.json(rows);
    } catch (err) { handleError(err, res); }
  }
}