import bcrypt from 'bcrypt';
import pool from '../db/conex.js';

class UsersService {
  // Helpers de sanitización y validación
  sanitizeText(v) { return String(v ?? '').trim(); }
  sanitizeTel(v) { return String(v ?? '').replace(/[^0-9]/g, '').slice(0, 11); }
  normalizeEmail(v) { return String(v ?? '').toLowerCase().trim(); }
  isEmail(v) { return /^(?=.{3,100}$)[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).toLowerCase()); }

  async hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(String(password), saltRounds);
  }

  async getAll() {
    const query = `
      SELECT 
        u.id_user, u.email, u.name, u.active, u.tel, u.created_at,
        GROUP_CONCAT(r.id_role) AS roles_ids,
        GROUP_CONCAT(r.name) AS roles_names
      FROM users u
      LEFT JOIN users_roles ur ON u.id_user = ur.id_user
      LEFT JOIN roles r ON ur.id_role = r.id_role
      GROUP BY u.id_user
      ORDER BY u.created_at DESC
    `;
    const [rows] = await pool.query(query);
    return rows.map(r => ({
      id_user: r.id_user,
      email: r.email,
      name: r.name,
      active: r.active,
      tel: r.tel,
      created_at: r.created_at,
      roles: r.roles_ids ? String(r.roles_ids).split(',').map(n => Number(n)) : [],
      roles_names: r.roles_names ? String(r.roles_names).split(',') : [],
    }));
  }

  async getById(id) {
    const query = `
      SELECT 
        u.id_user, u.email, u.name, u.active, u.tel, u.created_at,
        GROUP_CONCAT(r.id_role) AS roles_ids,
        GROUP_CONCAT(r.name) AS roles_names
      FROM users u
      LEFT JOIN users_roles ur ON u.id_user = ur.id_user
      LEFT JOIN roles r ON ur.id_role = r.id_role
      WHERE u.id_user = ?
      GROUP BY u.id_user
    `;
    const [rows] = await pool.query(query, [id]);
    const r = rows[0];
    if (!r) return null;
    return {
      id_user: r.id_user,
      email: r.email,
      name: r.name,
      active: r.active,
      tel: r.tel,
      created_at: r.created_at,
      roles: r.roles_ids ? String(r.roles_ids).split(',').map(n => Number(n)) : [],
      roles_names: r.roles_names ? String(r.roles_names).split(',') : [],
    };
  }

  async create({ name, email, password, tel, active = 1, roles = [] }) {
    if (!name || !email || !password) {
      throw { status: 400, message: 'Faltan campos obligatorios' };
    }
    if (!this.isEmail(email)) {
      throw { status: 400, message: 'Email inválido' };
    }

    try {

      const normalizedEmail = this.normalizeEmail(email);
      const sanitizedName = this.sanitizeText(name);
      const sanitizedTel = this.sanitizeTel(tel);
      const hashedPassword = await this.hashPassword(password);

      // Validar email único
      const [exists] = await pool.query('SELECT id_user FROM users WHERE email = ?', [normalizedEmail]);
      if (exists.length > 0) {
        throw { status: 409, message: 'El email ya está registrado' };
      }

      const [result] = await pool.query(
        'INSERT INTO users (name, email, password, tel, active) VALUES (?, ?, ?, ?, ?)',
        [sanitizedName, normalizedEmail, hashedPassword, sanitizedTel, Number(active) ? 1 : 0]
      );
      const userId = result.insertId;

      // Validar roles si se proporcionan
      if (roles && roles.length > 0) {
        const uniqueRoles = Array.from(new Set(roles.map(Number))).filter(Boolean);
        if (uniqueRoles.length > 0) {
          const [validRoles] = await pool.query(
            `SELECT id_role FROM roles WHERE id_role IN (${uniqueRoles.map(() => '?').join(',')})`,
            uniqueRoles
          );
          const validIds = new Set(validRoles.map(r => r.id_role));
          const invalid = uniqueRoles.filter(r => !validIds.has(r));
          if (invalid.length > 0) {
            throw { status: 400, message: `Roles inválidos: ${invalid.join(',')}` };
          }
          // Insertar relaciones
          for (const r of uniqueRoles) {
            await pool.query('INSERT INTO users_roles (id_user, id_role) VALUES (?, ?)', [userId, r]);
          }
        }
      }

      const user = await this.getById(userId);
      return user;
    } catch (err) {
      if (err.status) throw err;
      throw { status: 500, message: 'Error al crear usuario', cause: err };
    }
  }

  async update(id, data) {
    try {

      // Validar existencia
      const [exists] = await pool.query('SELECT * FROM users WHERE id_user = ?', [id]);
      if (exists.length === 0) return null;

      const fields = [];
      const values = [];

      if (data.name !== undefined) {
        fields.push('name = ?');
        values.push(this.sanitizeText(data.name));
      }
      if (data.email !== undefined) {
        const email = this.normalizeEmail(data.email);
        if (!this.isEmail(email)) throw { status: 400, message: 'Email inválido' };
        // verificar único para otro usuario
        const [dups] = await pool.query('SELECT id_user FROM users WHERE email = ? AND id_user <> ?', [email, id]);
        if (dups.length > 0) throw { status: 409, message: 'El email ya está en uso' };
        fields.push('email = ?');
        values.push(email);
      }
      if (data.password !== undefined) {
        if (data.password) {
          const hashed = await this.hashPassword(data.password);
          fields.push('password = ?');
          values.push(hashed);
        }
      }
      if (data.tel !== undefined) {
        fields.push('tel = ?');
        values.push(this.sanitizeTel(data.tel));
      }
      if (data.active !== undefined) {
        fields.push('active = ?');
        values.push(Number(data.active) ? 1 : 0);
      }

      if (fields.length > 0) {
        values.push(id);
        const updateQuery = `UPDATE users SET ${fields.join(', ')} WHERE id_user = ?`;
        await pool.query(updateQuery, values);
      }

      if (data.roles !== undefined) {
        const roles = Array.isArray(data.roles) ? data.roles.map(Number).filter(Boolean) : [];
        // Reemplazar relaciones
        await pool.query('DELETE FROM users_roles WHERE id_user = ?', [id]);
        if (roles.length > 0) {
          const [validRoles] = await pool.query(
            `SELECT id_role FROM roles WHERE id_role IN (${roles.map(() => '?').join(',')})`,
            roles
          );
          const validIds = new Set(validRoles.map(r => r.id_role));
          const invalid = roles.filter(r => !validIds.has(r));
          if (invalid.length > 0) throw { status: 400, message: `Roles inválidos: ${invalid.join(',')}` };
          for (const r of roles) {
            await pool.query('INSERT INTO users_roles (id_user, id_role) VALUES (?, ?)', [id, r]);
          }
        }
      }

      return await this.getById(id);
    } catch (err) {
      if (err.status) throw err;
      throw { status: 500, message: 'Error al actualizar usuario', cause: err };
    }
  }

  async delete(id) {
    try {
      await pool.query('DELETE FROM users_roles WHERE id_user = ?', [id]);
      const [result] = await pool.query('DELETE FROM users WHERE id_user = ?', [id]);
      if (result.affectedRows === 0) {
        return null;
      }
      return { id_user: Number(id), deleted: true };
    } catch (err) {
      if (err.status) throw err;
      throw { status: 500, message: 'Error al eliminar usuario', cause: err };
    }
  }

  async toggleActive(id) {
    const [rows] = await pool.query('SELECT active FROM users WHERE id_user = ?', [id]);
    if (rows.length === 0) return null;
    const current = Number(rows[0].active) ? 1 : 0;
    const next = current ? 0 : 1;
    await pool.query('UPDATE users SET active = ? WHERE id_user = ?', [next, id]);
    return await this.getById(id);
  }
}

export default new UsersService();

