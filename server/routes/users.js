import express from 'express';
import usersController from '../controllers/UsersController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Todas las rutas están protegidas con autenticación
router.use(requireAuth);

// Obtener todos los usuarios
router.get('/', usersController.getAll);

// Obtener un usuario por ID
router.get('/:id', usersController.getById);

// Crear un nuevo usuario
router.post('/', usersController.create);

// Actualizar un usuario
router.put('/:id', usersController.update);

// Eliminar un usuario
router.delete('/:id', usersController.delete);

// Toggle activar/desactivar usuario
router.patch('/:id/toggle', usersController.toggleActive);

export default router;

