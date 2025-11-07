import handleError from '../utils/handleError.js';

class LoansController {
    constructor(loansService) {
        this.service = loansService;
    }

    // Crear nuevo préstamo
    createLoan = async (req, res) => {
        const { id_inventory, quantity, applicant, observations_loan } = req.body;
        try {
            if (!id_inventory || !quantity) {
                throw { status: 400, message: 'Faltan datos obligatorios: id_inventory, quantity' };
            }

            if (quantity <= 0) {
                throw { status: 400, message: 'La cantidad debe ser un número positivo' };
            }

            const loan = await this.service.createLoan({
                id_user: req.user.id_user,
                id_inventory,
                quantity,
                applicant,
                observations_loan
            });

            res.status(201).json({
                success: true,
                message: 'Préstamo creado correctamente',
                loan
            });
        } catch (err) {
            return handleError(res, err);
        }
    };

    // Obtener todos los préstamos
    getAllLoans = async (req, res) => {
        try {
            const filters = {
                state: req.query.state,
                id_user: req.query.id_user,
                id_inventory: req.query.id_inventory,
                applicant: req.query.applicant,
                date_from: req.query.date_from,
                date_to: req.query.date_to
            };

            const loans = await this.service.getAllLoans(filters);

            res.status(200).json({
                success: true,
                message: 'Préstamos obtenidos correctamente',
                loans,
                count: loans.length
            });
        } catch (err) {
            return handleError(res, err);
        }
    };

    // Obtener préstamo por ID
    getLoanById = async (req, res) => {
        const { id } = req.params;
        try {
            if (!id || isNaN(id)) {
                throw { status: 400, message: 'ID de préstamo inválido' };
            }

            const loan = await this.service.getLoanById(id);

            res.status(200).json({
                success: true,
                message: 'Préstamo obtenido correctamente',
                loan
            });
        } catch (err) {
            return handleError(res, err);
        }
    };

    // Devolver préstamo
    returnLoan = async (req, res) => {
        const { id } = req.params;
        const { observations_return } = req.body;
        try {
            if (!id || isNaN(id)) {
                throw { status: 400, message: 'ID de préstamo inválido' };
            }

            const loan = await this.service.returnLoan(id, { observations_return });

            res.status(200).json({
                success: true,
                message: 'Préstamo devuelto correctamente',
                loan
            });
        } catch (err) {
            return handleError(res, err);
        }
    };

    // Actualizar préstamo
    updateLoan = async (req, res) => {
        const { id } = req.params;
        const { applicant, observations_loan } = req.body;
        try {
            if (!id || isNaN(id)) {
                throw { status: 400, message: 'ID de préstamo inválido' };
            }

            const loan = await this.service.updateLoan(id, { applicant, observations_loan });

            res.status(200).json({
                success: true,
                message: 'Préstamo actualizado correctamente',
                loan
            });
        } catch (err) {
            return handleError(res, err);
        }
    };

    // Eliminar préstamo
    deleteLoan = async (req, res) => {
        const { id } = req.params;
        try {
            if (!id || isNaN(id)) {
                throw { status: 400, message: 'ID de préstamo inválido' };
            }

            const result = await this.service.deleteLoan(id);

            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (err) {
            return handleError(res, err);
        }
    };

    // Obtener préstamos por usuario
    getLoansByUser = async (req, res) => {
        const { userId } = req.params;
        try {
            if (!userId || isNaN(userId)) {
                throw { status: 400, message: 'ID de usuario inválido' };
            }

            const loans = await this.service.getLoansByUser(userId);

            res.status(200).json({
                success: true,
                message: 'Préstamos del usuario obtenidos correctamente',
                loans,
                count: loans.length
            });
        } catch (err) {
            return handleError(res, err);
        }
    };

    // Obtener préstamos por item
    getLoansByItem = async (req, res) => {
        const { itemId } = req.params;
        try {
            if (!itemId || isNaN(itemId)) {
                throw { status: 400, message: 'ID de item inválido' };
            }

            const loans = await this.service.getLoansByItem(itemId);

            res.status(200).json({
                success: true,
                message: 'Préstamos del item obtenidos correctamente',
                loans,
                count: loans.length
            });
        } catch (err) {
            return handleError(res, err);
        }
    };

    // Obtener mis préstamos (usuario autenticado)
    getMyLoans = async (req, res) => {
        try {
            const loans = await this.service.getLoansByUser(req.user.id_user);

            res.status(200).json({
                success: true,
                message: 'Mis préstamos obtenidos correctamente',
                loans,
                count: loans.length
            });
        } catch (err) {
            return handleError(res, err);
        }
    };

    // Obtener estadísticas de préstamos
    getLoansStats = async (req, res) => {
        try {
            const stats = await this.service.getLoansStats();

            res.status(200).json({
                success: true,
                message: 'Estadísticas obtenidas correctamente',
                stats
            });
        } catch (err) {
            return handleError(res, err);
        }
    };
}

export default LoansController;