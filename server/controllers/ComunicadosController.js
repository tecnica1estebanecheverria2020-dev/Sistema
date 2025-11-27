import handleError from '../utils/handleError.js'

class ComunicadosController {
  constructor(service) {
    this.service = service
  }

  create = async (req, res) => {
    try {
      const tipo = String(req.body?.tipo || '').toLowerCase()
      if (!['informativo', 'previas', 'social'].includes(tipo)) {
        throw { status: 400, message: 'Tipo de comunicado inválido' }
      }

      let titulo = ''
      let contenido_html = ''
      let bg_color = null
      let bg_image_url = null
      let bg_opacity = 0
      let payload = {}

      if (tipo === 'informativo') {
        titulo = String(req.body?.titulo || '').trim()
        contenido_html = String(req.body?.contenido || '')
        bg_color = req.body?.bgColor || null
        bg_image_url = req.body?.bgImage || null
        bg_opacity = Number(req.body?.bgOpacity ?? 0)

        const imagenes = Array.isArray(req.body?.imagenes) ? req.body.imagenes.map((it) => ({
          src: String(it?.src || ''),
          w: Number(it?.w ?? 0) || null,
          h: Number(it?.h ?? 0) || null,
          x: Number(it?.x ?? 0),
          y: Number(it?.y ?? 0),
          z: Number(it?.z ?? 1),
        })) : []
        const links = Array.isArray(req.body?.links) ? req.body.links.map((l) => ({
          label: String(l?.label || ''),
          url: String(l?.url || ''),
        })) : []
        const icons = Array.isArray(req.body?.icons) ? req.body.icons.map((k) => String(k || '')) : []
        const iconUrls = Array.isArray(req.body?.iconUrls) ? req.body.iconUrls.map((u) => String(u || '')) : []

        payload = { imagenes, links, icons, iconUrls }
      }

      if (tipo === 'previas') {
        titulo = String(req.body?.titulo || 'Inscripciones a Previas').trim()
        const fechas = Array.isArray(req.body?.fechas) ? req.body.fechas.map((f) => String(f || '')) : []
        const materias = Array.isArray(req.body?.materias) ? req.body.materias.map((m) => String(m || '')) : []
        const requisitos = String(req.body?.requisitos || '')
        const contacto = req.body?.contacto ? {
          nombre: String(req.body.contacto?.nombre || ''),
          email: String(req.body.contacto?.email || ''),
          telefono: String(req.body.contacto?.telefono || ''),
        } : null
        payload = { fechas, materias, requisitos, contacto }
      }

      if (tipo === 'social') {
        titulo = String(req.body?.titulo || 'Social').trim()
        const mensaje = String(req.body?.mensaje || '')
        const etiquetas = Array.isArray(req.body?.etiquetas) ? req.body.etiquetas.map((t) => String(t || '')) : []
        bg_color = req.body?.bgColor || null
        bg_image_url = req.body?.bgImage || null
        bg_opacity = Number(req.body?.bgOpacity ?? 0)
        const galeria = Array.isArray(req.body?.galeria) ? req.body.galeria.map((it) => ({
          src: String(it?.src || ''),
          w: Number(it?.w ?? 0) || null,
          h: Number(it?.h ?? 0) || null,
          x: Number(it?.x ?? 0),
          y: Number(it?.y ?? 0),
          z: Number(it?.z ?? 1),
        })) : []
        payload = { mensaje, etiquetas, galeria }
      }

      if (!titulo) {
        throw { status: 400, message: 'Título requerido' }
      }

      const created_by = req.user?.id_user || null

      const record = {
        tipo,
        titulo,
        contenido_html,
        bg_color,
        bg_image_url,
        bg_opacity,
        payload,
        created_by
      }

      const result = await this.service.create(record)

      res.status(201).json({
        success: true,
        message: 'Comunicado creado',
        id_comunicado: result.id_comunicado
      })
    } catch (err) {
      handleError(res, err)
    }
  }

  getAll = async (req, res) => {
    try {
      const rows = await this.service.getAll()
      res.status(200).json(rows)
    } catch (err) {
      handleError(res, err)
    }
  }

  getById = async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10)
      if (isNaN(id)) {
        throw { status: 400, message: 'ID inválido' }
      }
      const row = await this.service.getById(id)
      if (!row) {
        throw { status: 404, message: 'Comunicado no encontrado' }
      }
      res.status(200).json(row)
    } catch (err) {
      handleError(res, err)
    }
  }
}

export default ComunicadosController
