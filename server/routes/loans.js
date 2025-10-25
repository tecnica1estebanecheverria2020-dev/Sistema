import express from 'express';
import LoansController from '../controllers/LoansController.js';
import LoansService from '../services/LoansService.js';
import pool from '../db/conex.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

const loansService = new LoansService(pool);
const loansController = new LoansController(loansService);

// Rutas de préstamos
router.get('/', requireAuth, loansController.getAllLoans);
router.get('/stats', requireAuth, loansController.getLoansStats);
router.get('/my-loans', requireAuth, loansController.getMyLoans);
router.get('/user/:userId', requireAuth, loansController.getLoansByUser);
router.get('/item/:itemId', requireAuth, loansController.getLoansByItem);
router.get('/:id', requireAuth, loansController.getLoanById);
router.post('/', requireAuth, loansController.createLoan);
router.put('/:id', requireAuth, loansController.updateLoan);
router.patch('/:id/return', requireAuth, loansController.returnLoan);
router.delete('/:id', requireAuth, loansController.deleteLoan);

export default router;