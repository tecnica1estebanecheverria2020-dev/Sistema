import express from 'express';
import RolesController from '../controllers/RolesController.js';
import RolesService from '../services/RolesService.js';
import pool from '../db/conex.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

const rolesService = new RolesService(pool);
const rolesController = new RolesController(rolesService);

// Rutas de roles
router.get('/', requireAuth, rolesController.getAllRoles);
router.get('/stats', requireAuth, rolesController.getRolesStats);
router.get('/:id', requireAuth, rolesController.getRoleById);
router.get('/:id/users', requireAuth, rolesController.getUsersByRole);
router.post('/', requireAuth, rolesController.createRole);
router.put('/:id', requireAuth, rolesController.updateRole);
router.delete('/:id', requireAuth, rolesController.deleteRole);

export default router;