import pool from '../db/conex.js';

class InventarioService {
  async getAll() {
    const query = 'SELECT * FROM inventario';
    const { rows } = await pool.query(query);
    return rows;
  }

  async getById(id) {
    const query = 'SELECT * FROM inventario WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  async create(item) {
    const query = `
      INSERT INTO inventario (nombre, categoria, cantidad, disponible, estado, ubicacion)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [
      item.nombre,
      item.categoria,
      item.cantidad,
      item.disponible,
      item.estado,
      item.ubicacion
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  async update(id, item) {
    const query = `
      UPDATE inventario
      SET nombre = $1, categoria = $2, cantidad = $3, disponible = $4, estado = $5, ubicacion = $6
      WHERE id = $7
      RETURNING *
    `;
    const values = [
      item.nombre,
      item.categoria,
      item.cantidad,
      item.disponible,
      item.estado,
      item.ubicacion,
      id
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  async delete(id) {
    const query = 'DELETE FROM inventario WHERE id = $1 RETURNING *';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
}

export default new InventarioService();