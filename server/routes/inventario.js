import express from 'express';
import inventarioController from '../controllers/InventarioController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Todas las rutas están protegidas con autenticación
router.use(requireAuth);

// Obtener todos los items
router.get('/', inventarioController.getAll);

// Obtener un item por ID
router.get('/:id', inventarioController.getById);

// Crear un nuevo item
router.post('/', inventarioController.create);

// Actualizar un item
router.put('/:id', inventarioController.update);

// Eliminar un item
router.delete('/:id', inventarioController.delete);

export default router;