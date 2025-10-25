import handleError from '../utils/handleError.js';

class InventarioController {
    constructor(inventarioService) {
        this.service = inventarioService;
    }

    // Crear nuevo item de inventario
    createItem = async (req, res) => {
        const { name, code, category, amount, available, state, location, description } = req.body;
        try {
            if (!name || !category || !amount) {
                throw { status: 400, message: 'Faltan datos obligatorios: name, category, amount' };
            }

            if (amount < 0 || (available && available < 0)) {
                throw { status: 400, message: 'Las cantidades no pueden ser negativas' };
            }

            if (available && available > amount) {
                throw { status: 400, message: 'La cantidad disponible no puede ser mayor al total' };
            }

            const item = await this.service.createItem({ 
                name, 
                code, 
                category, 
                amount, 
                available, 
                state, 
                location, 
                description 
            });

            res.status(201).json({
                success: true,
                message: 'Item de inventario creado correctamente',
                item
            });
        } catch (err) {
            return handleError(res, err);
        }
    };

    // Obtener todos los items del inventario
    getAllItems = async (req, res) => {
        try {
            const filters = {
                category: req.query.category,
                state: req.query.state,
                location: req.query.location,
                search: req.query.search
            };

            const items = await this.service.getAllItems(filters);

            res.status(200).json({
                success: true,
                message: 'Items obtenidos correctamente',
                items,
                count: items.length
            });
        } catch (err) {
            return handleError(res, err);
        }
    };

    // Obtener item por ID
    getItemById = async (req, res) => {
        const { id } = req.params;
        try {
            if (!id || isNaN(id)) {
                throw { status: 400, message: 'ID de item inválido' };
            }

            const item = await this.service.getItemById(id);

            res.status(200).json({
                success: true,
                message: 'Item obtenido correctamente',
                item
            });
        } catch (err) {
            return handleError(res, err);
        }
    };

    // Actualizar item del inventario
    updateItem = async (req, res) => {
        const { id } = req.params;
        const { name, code, category, amount, available, state, location, description } = req.body;
        try {
            if (!id || isNaN(id)) {
                throw { status: 400, message: 'ID de item inválido' };
            }

            if (!name || !category || amount === undefined) {
                throw { status: 400, message: 'Faltan datos obligatorios: name, category, amount' };
            }

            if (amount < 0 || (available && available < 0)) {
                throw { status: 400, message: 'Las cantidades no pueden ser negativas' };
            }

            if (available && available > amount) {
                throw { status: 400, message: 'La cantidad disponible no puede ser mayor al total' };
            }

            const item = await this.service.updateItem(id, { 
                name, 
                code, 
                category, 
                amount, 
                available, 
                state, 
                location, 
                description 
            });

            res.status(200).json({
                success: true,
                message: 'Item actualizado correctamente',
                item
            });
        } catch (err) {
            return handleError(res, err);
        }
    };

    // Eliminar item del inventario
    deleteItem = async (req, res) => {
        const { id } = req.params;
        try {
            if (!id || isNaN(id)) {
                throw { status: 400, message: 'ID de item inválido' };
            }

            const result = await this.service.deleteItem(id);

            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (err) {
            return handleError(res, err);
        }
    };

    // Actualizar disponibilidad del item
    updateAvailability = async (req, res) => {
        const { id } = req.params;
        const { quantity, operation } = req.body;
        try {
            if (!id || isNaN(id)) {
                throw { status: 400, message: 'ID de item inválido' };
            }

            if (!quantity || quantity <= 0) {
                throw { status: 400, message: 'La cantidad debe ser un número positivo' };
            }

            if (operation && !['add', 'subtract'].includes(operation)) {
                throw { status: 400, message: 'Operación inválida. Use "add" o "subtract"' };
            }

            const item = await this.service.updateAvailability(id, quantity, operation);

            res.status(200).json({
                success: true,
                message: 'Disponibilidad actualizada correctamente',
                item
            });
        } catch (err) {
            return handleError(res, err);
        }
    };

    // Obtener categorías únicas
    getCategories = async (req, res) => {
        try {
            const categories = await this.service.getCategories();

            res.status(200).json({
                success: true,
                message: 'Categorías obtenidas correctamente',
                categories
            });
        } catch (err) {
            return handleError(res, err);
        }
    };

    // Obtener ubicaciones únicas
    getLocations = async (req, res) => {
        try {
            const locations = await this.service.getLocations();

            res.status(200).json({
                success: true,
                message: 'Ubicaciones obtenidas correctamente',
                locations
            });
        } catch (err) {
            return handleError(res, err);
        }
    };
}

export default InventarioController;