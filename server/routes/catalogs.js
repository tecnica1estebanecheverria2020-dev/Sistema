import express from 'express';
import pool from '../db/conex.js';
import { requireAuth } from '../middlewares/authMiddleware.js';
import CatalogsService from '../services/CatalogsService.js';
import CatalogsController from '../controllers/CatalogsController.js';

const router = express.Router();

const service = new CatalogsService(pool);
const controller = new CatalogsController(service);

router.get('/classrooms', requireAuth, controller.getClassrooms);
router.get('/workshop-groups', requireAuth, controller.getWorkshopGroups);
router.get('/subjects', requireAuth, controller.getSubjects);
router.get('/teachers', requireAuth, controller.getTeachers);
router.get('/subject-users', requireAuth, controller.getSubjectUsers);

export default router;