import express from 'express';
import InventarioController from '../controllers/InventarioController.js';
import InventarioService from '../services/InventarioService.js';
import pool from '../db/conex.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

const inventarioService = new InventarioService(pool);
const inventarioController = new InventarioController(inventarioService);

// Rutas de inventario
router.get('/', requireAuth, inventarioController.getAllItems);
router.get('/categories', requireAuth, inventarioController.getCategories);
router.get('/locations', requireAuth, inventarioController.getLocations);
router.get('/:id', requireAuth, inventarioController.getItemById);
router.post('/', requireAuth, inventarioController.createItem);
router.put('/:id', requireAuth, inventarioController.updateItem);
router.patch('/:id/availability', requireAuth, inventarioController.updateAvailability);
router.delete('/:id', requireAuth, inventarioController.deleteItem);

export default router;