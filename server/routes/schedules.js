import express from 'express';
import SchedulesController from '../controllers/SchedulesController.js';
import SchedulesService from '../services/SchedulesService.js';
import pool from '../db/conex.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

const schedulesService = new SchedulesService(pool);
const schedulesController = new SchedulesController(schedulesService);

// Rutas de horarios
router.get('/', requireAuth, schedulesController.getAllSchedules);
router.get('/stats', requireAuth, schedulesController.getSchedulesStats);
router.get('/weekly', requireAuth, schedulesController.getWeeklySchedule);
router.get('/day/:day', requireAuth, schedulesController.getSchedulesByDay);
router.get('/:id', requireAuth, schedulesController.getScheduleById);
router.post('/', requireAuth, schedulesController.createSchedule);
router.put('/:id', requireAuth, schedulesController.updateSchedule);
router.delete('/:id', requireAuth, schedulesController.deleteSchedule);

export default router;