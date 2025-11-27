class ComunicadosService {
  constructor(conex) {
    this.conex = conex
  }

  async ensureSchema() {
    const sql = `
      CREATE TABLE IF NOT EXISTS comunicados (
        id_comunicado INT AUTO_INCREMENT PRIMARY KEY,
        tipo VARCHAR(20) NOT NULL,
        titulo VARCHAR(255) NOT NULL,
        contenido_html MEDIUMTEXT,
        bg_color VARCHAR(20),
        bg_image_url TEXT,
        bg_opacity DECIMAL(3,2) DEFAULT 0.0,
        payload JSON NOT NULL,
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `
    await this.conex.query(sql)
  }

  async create(record) {
    const {
      tipo,
      titulo,
      contenido_html,
      bg_color,
      bg_image_url,
      bg_opacity,
      payload,
      created_by
    } = record

    await this.ensureSchema()

    const [res] = await this.conex.query(
      'INSERT INTO comunicados (tipo, titulo, contenido_html, bg_color, bg_image_url, bg_opacity, payload, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        String(tipo),
        String(titulo),
        contenido_html ?? null,
        bg_color ?? null,
        bg_image_url ?? null,
        Number(bg_opacity ?? 0),
        JSON.stringify(payload ?? {}),
        created_by ?? null,
      ]
    )

    return { id_comunicado: res.insertId }
  }

  async getAll() {
    await this.ensureSchema()
    const [rows] = await this.conex.query(
      `SELECT c.*, u.name AS author_name
       FROM comunicados c
       LEFT JOIN users u ON c.created_by = u.id_user
       ORDER BY c.created_at DESC`
    )
    return rows.map((r) => ({
      ...r,
      payload: (() => { try { return JSON.parse(r.payload || '{}') } catch { return {} } })()
    }))
  }

  async getById(id) {
    await this.ensureSchema()
    const [rows] = await this.conex.query(
      `SELECT c.*, u.name AS author_name
       FROM comunicados c
       LEFT JOIN users u ON c.created_by = u.id_user
       WHERE c.id_comunicado = ?`,
      [id]
    )
    if (rows.length === 0) return null
    const r = rows[0]
    return {
      ...r,
      payload: (() => { try { return JSON.parse(r.payload || '{}') } catch { return {} } })()
    }
  }
}

export default ComunicadosService
