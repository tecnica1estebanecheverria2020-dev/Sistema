class ComunicadosService {
  constructor(conex) {
    this.conex = conex
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

  async delete(id) {
    const [res] = await this.conex.query(
      'DELETE FROM comunicados WHERE id_comunicado = ?',
      [id]
    )
    return res.affectedRows > 0
  }
}

export default ComunicadosService
