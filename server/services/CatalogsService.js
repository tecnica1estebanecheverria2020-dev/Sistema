import log from '../utils/log.js';

export default class CatalogsService {
  constructor(pool) {
    this.pool = pool;
  }

  async getClassrooms() {
    const [rows] = await this.pool.query(
      'SELECT id_classroom AS id, name FROM classroom ORDER BY name'
    );
    return rows;
  }

  async getWorkshopGroups() {
    const [rows] = await this.pool.query(
      'SELECT id_workshop_group AS id, name FROM workshop_group ORDER BY name'
    );
    return rows;
  }

  async getSubjects() {
    const [rows] = await this.pool.query(
      'SELECT id_subject AS id, name FROM subject ORDER BY name'
    );
    return rows;
  }

  async getTeachers() {
    const [rows] = await this.pool.query(
      'SELECT id_user AS id, name FROM users ORDER BY name'
    );
    return rows;
  }

  async getSubjectUsers({ teacher_id = null, subject_id = null } = {}) {
    let sql = `
      SELECT 
        su.id_subject_user,
        su.id_subject,
        s.name AS subject_name,
        su.id_user,
        u.name AS teacher_name
      FROM subject_user su
      JOIN subject s ON s.id_subject = su.id_subject
      JOIN users u ON u.id_user = su.id_user
    `;
    const params = [];
    const where = [];
    if (teacher_id) { where.push('su.id_user = ?'); params.push(teacher_id); }
    if (subject_id) { where.push('su.id_subject = ?'); params.push(subject_id); }
    if (where.length) sql += ' WHERE ' + where.join(' AND ');
    sql += ' ORDER BY teacher_name, subject_name';
    const [rows] = await this.pool.query(sql, params);
    return rows;
  }
}