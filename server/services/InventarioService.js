import pool from '../db/conex.js';

class InventarioService {
  async getAll() {
    const query = 'SELECT * FROM inventory';
    const [rows] = await pool.query(query);
    return rows;
  }

  async getById(id) {
    const query = 'SELECT * FROM inventory WHERE id_inventory = ?';
    const [rows] = await pool.query(query, [id]);
    return rows[0] || null;
  }


  async create(item) {
    const query = `
      INSERT INTO inventory (code, category, amount, available, state, location, description)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [item.code, item.category, item.amount, item.available, item.state, item.location, item.description];
    const [result] = await pool.query(query, values);
    const createdId = result.insertId;
    return await this.getById(createdId);
  }

  async update(id, item) {
    const query = `
      UPDATE inventory
      SET code = ?, category = ?, amount = ?, available = ?, state = ?, location = ?, description = ?
      WHERE id_inventory = ?
    `;
    const values = [item.code, item.category, item.amount, item.available, item.state, item.location, item.description, id];
    const [result] = await pool.query(query, values);
    if (result.affectedRows === 0) return null;
    return await this.getById(id);
  }

  async delete(id) {
    const query = 'DELETE FROM inventory WHERE id_inventory = ?';
    const [result] = await pool.query(query, [id]);
    if (result.affectedRows === 0) return null;
    return { id_inventory: Number(id), deleted: true };
  }
}

export default new InventarioService();