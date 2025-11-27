import express from 'express'
import ComunicadosController from '../controllers/ComunicadosController.js'
import ComunicadosService from '../services/ComunicadosService.js'
import pool from '../db/conex.js'
import { requireAuth } from '../middlewares/authMiddleware.js'

const router = express.Router()

const comunicadosService = new ComunicadosService(pool)
const comunicadosController = new ComunicadosController(comunicadosService)

router.get('/', requireAuth, comunicadosController.getAll)
router.get('/:id', requireAuth, comunicadosController.getById)
router.post('/', requireAuth, comunicadosController.create)

export default router
