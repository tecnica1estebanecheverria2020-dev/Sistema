class LoansService {
    constructor(conex) {
        this.conex = conex;
    }

    // Crear nuevo préstamo
    createLoan = async (loanData) => {
        try {
            const { id_user, id_inventory, quantity, applicant, observations_loan, id_authorizer } = loanData;
            
            const [inventoryItems] = await this.conex.query(
                'SELECT * FROM inventory WHERE id_inventory = ?',
                [id_inventory]
            );

            if (inventoryItems.length === 0) {
                throw { status: 404, message: 'Item de inventario no encontrado' };
            }

            const item = inventoryItems[0];
            if (item.available < quantity) {
                throw { status: 400, message: 'No hay suficiente cantidad disponible para el préstamo' };
            }

            // Crear el préstamo
            const [result] = await this.conex.query(
                'INSERT INTO loans (id_user, id_authorizer, id_inventory, quantity, applicant, observations_loan) VALUES (?, ?, ?, ?, ?, ?)',
                [id_user, id_authorizer ?? null, id_inventory, quantity, applicant ?? null, observations_loan ?? null]
            );

            await this.conex.query(
                'UPDATE inventory SET available = available - ? WHERE id_inventory = ?',
                [quantity, id_inventory]
            );

            return {
                id_loan: result.insertId,
                id_user,
                id_authorizer: id_authorizer ?? null,
                id_inventory,
                quantity,
                applicant: applicant ?? null,
                date_loan: new Date(),
                state: 'activo',
                observations_loan: observations_loan ?? null
            };
        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: 'Error al crear el préstamo', cause: error };
        }
    };

    // Obtener todos los préstamos
    getAllLoans = async (filters = {}) => {
        try {
            let query = `
                SELECT l.*, 
                       u.name as user_name, u.email as user_email,
                       au.name as authorizer_name,
                       i.name as item_name, i.code as item_code, i.category as item_category
                FROM loans l
                JOIN users u ON l.id_user = u.id_user
                LEFT JOIN users au ON l.id_authorizer = au.id_user
                JOIN inventory i ON l.id_inventory = i.id_inventory
                WHERE 1=1
            `;
            const params = [];

            if (filters.state) {
                query += ' AND l.state = ?';
                params.push(filters.state);
            }

            if (filters.id_user) {
                query += ' AND l.id_user = ?';
                params.push(filters.id_user);
            }

            if (filters.id_inventory) {
                query += ' AND l.id_inventory = ?';
                params.push(filters.id_inventory);
            }

            if (filters.applicant) {
                query += ' AND l.applicant LIKE ?';
                params.push(`%${filters.applicant}%`);
            }

            if (filters.date_from) {
                query += ' AND DATE(l.date_loan) >= ?';
                params.push(filters.date_from);
            }

            if (filters.date_to) {
                query += ' AND DATE(l.date_loan) <= ?';
                params.push(filters.date_to);
            }

            query += ' ORDER BY l.date_loan DESC';

            const [loans] = await this.conex.query(query, params);
            return loans;
        } catch (error) {
            throw { status: 500, message: 'Error al obtener los préstamos', cause: error };
        }
    };

    // Obtener préstamo por ID
    getLoanById = async (id) => {
        try {
            const [loans] = await this.conex.query(`
                SELECT l.*, 
                       u.name as user_name, u.email as user_email,
                       au.name as authorizer_name,
                       i.name as item_name, i.code as item_code, i.category as item_category
                FROM loans l
                JOIN users u ON l.id_user = u.id_user
                LEFT JOIN users au ON l.id_authorizer = au.id_user
                JOIN inventory i ON l.id_inventory = i.id_inventory
                WHERE l.id_loan = ?
            `, [id]);

            if (loans.length === 0) {
                throw { status: 404, message: 'Préstamo no encontrado' };
            }

            return loans[0];
        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: 'Error al obtener el préstamo', cause: error };
        }
    };

    // Devolver préstamo
    returnLoan = async (id, returnData) => {
        try {
            const { observations_return } = returnData;

            // Verificar que el préstamo existe y está activo
            const loan = await this.getLoanById(id);
            
            if (loan.state !== 'activo') {
                throw { status: 400, message: 'El préstamo ya ha sido devuelto' };
            }

            // Actualizar el préstamo
            await this.conex.query(
                'UPDATE loans SET state = "devuelto", date_return = NOW(), observations_return = ? WHERE id_loan = ?',
                [observations_return, id]
            );

            // Restaurar la disponibilidad del item
            await this.conex.query(
                'UPDATE inventory SET available = available + ? WHERE id_inventory = ?',
                [loan.quantity, loan.id_inventory]
            );

            return await this.getLoanById(id);
        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: 'Error al devolver el préstamo', cause: error };
        }
    };

    // Actualizar préstamo (solo observaciones y solicitante)
    updateLoan = async (id, loanData) => {
        try {
            const { applicant, observations_loan } = loanData;

            // Verificar que el préstamo existe
            const loan = await this.getLoanById(id);
            
            if (loan.state !== 'activo') {
                throw { status: 400, message: 'Solo se pueden modificar préstamos activos' };
            }

            const [result] = await this.conex.query(
                'UPDATE loans SET applicant = ?, observations_loan = ? WHERE id_loan = ?',
                [applicant, observations_loan, id]
            );

            if (result.affectedRows === 0) {
                throw { status: 404, message: 'Préstamo no encontrado' };
            }

            return await this.getLoanById(id);
        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: 'Error al actualizar el préstamo', cause: error };
        }
    };

    // Eliminar préstamo (solo si está devuelto)
    deleteLoan = async (id) => {
        try {
            const loan = await this.getLoanById(id);
            
            if (loan.state === 'activo') {
                throw { status: 400, message: 'No se puede eliminar un préstamo activo. Debe devolverlo primero.' };
            }

            const [result] = await this.conex.query(
                'DELETE FROM loans WHERE id_loan = ?',
                [id]
            );

            if (result.affectedRows === 0) {
                throw { status: 404, message: 'Préstamo no encontrado' };
            }

            return { message: 'Préstamo eliminado correctamente' };
        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: 'Error al eliminar el préstamo', cause: error };
        }
    };

    // Obtener préstamos por usuario
    getLoansByUser = async (userId) => {
        try {
            const [loans] = await this.conex.query(`
                SELECT l.*, 
                       i.name as item_name, i.code as item_code, i.category as item_category
                FROM loans l
                JOIN inventory i ON l.id_inventory = i.id_inventory
                WHERE l.id_user = ?
                ORDER BY l.date_loan DESC
            `, [userId]);

            return loans;
        } catch (error) {
            throw { status: 500, message: 'Error al obtener los préstamos del usuario', cause: error };
        }
    };

    // Obtener préstamos por item de inventario
    getLoansByItem = async (itemId) => {
        try {
            const [loans] = await this.conex.query(`
                SELECT l.*, 
                       u.name as user_name, u.email as user_email
                FROM loans l
                JOIN users u ON l.id_user = u.id_user
                WHERE l.id_inventory = ?
                ORDER BY l.date_loan DESC
            `, [itemId]);

            return loans;
        } catch (error) {
            throw { status: 500, message: 'Error al obtener los préstamos del item', cause: error };
        }
    };

    // Obtener estadísticas de préstamos
    getLoansStats = async () => {
        try {
            const [stats] = await this.conex.query(`
                SELECT 
                    COUNT(*) as total_loans,
                    SUM(CASE WHEN state = 'activo' THEN 1 ELSE 0 END) as active_loans,
                    SUM(CASE WHEN state = 'devuelto' THEN 1 ELSE 0 END) as returned_loans,
                    COUNT(DISTINCT id_user) as unique_users,
                    COUNT(DISTINCT id_inventory) as unique_items
                FROM loans
            `);

            return stats[0];
        } catch (error) {
            throw { status: 500, message: 'Error al obtener las estadísticas', cause: error };
        }
    };
}

export default LoansService;