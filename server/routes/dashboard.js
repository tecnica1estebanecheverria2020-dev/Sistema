import express from 'express';
import DashboardController from '../controllers/DashboardController.js';
import DashboardService from '../services/DashboardService.js';
import pool from '../db/conex.js';

const router = express.Router();

const dashboardService = new DashboardService(pool);
const dashboardController = new DashboardController(dashboardService);

router.get('/data', dashboardController.getData);
router.get('/today-loans', dashboardController.getTodayLoans);

export default router;