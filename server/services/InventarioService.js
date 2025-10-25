class InventarioService {
    constructor(conex) {
        this.conex = conex;
    }

    // Crear nuevo item de inventario
    createItem = async (itemData) => {
        try {
            const { name, code, category, amount, available, state, location, description } = itemData;
            
            const [result] = await this.conex.query(
                'INSERT INTO inventory (name, code, category, amount, available, state, location, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [name, code, category, amount, available || amount, state || 'activo', location, description]
            );

            return {
                id_inventory: result.insertId,
                name,
                code,
                category,
                amount,
                available: available || amount,
                state: state || 'activo',
                location,
                description
            };
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw { status: 409, message: 'Ya existe un item con ese código' };
            }
            throw { status: 500, message: 'Error al crear el item de inventario', cause: error };
        }
    };

    // Obtener todos los items del inventario
    getAllItems = async (filters = {}) => {
        try {
            let query = 'SELECT * FROM inventory WHERE 1=1';
            const params = [];

            if (filters.category) {
                query += ' AND category = ?';
                params.push(filters.category);
            }

            if (filters.state) {
                query += ' AND state = ?';
                params.push(filters.state);
            }

            if (filters.location) {
                query += ' AND location = ?';
                params.push(filters.location);
            }

            if (filters.search) {
                query += ' AND (name LIKE ? OR code LIKE ? OR description LIKE ?)';
                const searchTerm = `%${filters.search}%`;
                params.push(searchTerm, searchTerm, searchTerm);
            }

            query += ' ORDER BY name ASC';

            const [items] = await this.conex.query(query, params);
            return items;
        } catch (error) {
            throw { status: 500, message: 'Error al obtener los items del inventario', cause: error };
        }
    };

    // Obtener item por ID
    getItemById = async (id) => {
        try {
            const [items] = await this.conex.query(
                'SELECT * FROM inventory WHERE id_inventory = ?',
                [id]
            );

            if (items.length === 0) {
                throw { status: 404, message: 'Item de inventario no encontrado' };
            }

            return items[0];
        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: 'Error al obtener el item del inventario', cause: error };
        }
    };

    // Actualizar item del inventario
    updateItem = async (id, itemData) => {
        try {
            const { name, code, category, amount, available, state, location, description } = itemData;

            const [result] = await this.conex.query(
                'UPDATE inventory SET name = ?, code = ?, category = ?, amount = ?, available = ?, state = ?, location = ?, description = ? WHERE id_inventory = ?',
                [name, code, category, amount, available, state, location, description, id]
            );

            if (result.affectedRows === 0) {
                throw { status: 404, message: 'Item de inventario no encontrado' };
            }

            return await this.getItemById(id);
        } catch (error) {
            if (error.status) throw error;
            if (error.code === 'ER_DUP_ENTRY') {
                throw { status: 409, message: 'Ya existe un item con ese código' };
            }
            throw { status: 500, message: 'Error al actualizar el item del inventario', cause: error };
        }
    };

    // Eliminar item del inventario
    deleteItem = async (id) => {
        try {
            // Verificar si el item tiene préstamos activos
            const [loans] = await this.conex.query(
                'SELECT COUNT(*) as count FROM loans WHERE id_inventory = ? AND state = "activo"',
                [id]
            );

            if (loans[0].count > 0) {
                throw { status: 409, message: 'No se puede eliminar el item porque tiene préstamos activos' };
            }

            const [result] = await this.conex.query(
                'DELETE FROM inventory WHERE id_inventory = ?',
                [id]
            );

            if (result.affectedRows === 0) {
                throw { status: 404, message: 'Item de inventario no encontrado' };
            }

            return { message: 'Item eliminado correctamente' };
        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: 'Error al eliminar el item del inventario', cause: error };
        }
    };

    // Actualizar disponibilidad del item
    updateAvailability = async (id, quantity, operation = 'subtract') => {
        try {
            const item = await this.getItemById(id);
            
            let newAvailable;
            if (operation === 'subtract') {
                newAvailable = item.available - quantity;
                if (newAvailable < 0) {
                    throw { status: 400, message: 'No hay suficiente cantidad disponible' };
                }
            } else if (operation === 'add') {
                newAvailable = item.available + quantity;
                if (newAvailable > item.amount) {
                    throw { status: 400, message: 'La cantidad disponible no puede ser mayor al total' };
                }
            }

            await this.conex.query(
                'UPDATE inventory SET available = ? WHERE id_inventory = ?',
                [newAvailable, id]
            );

            return await this.getItemById(id);
        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: 'Error al actualizar la disponibilidad', cause: error };
        }
    };

    // Obtener categorías únicas
    getCategories = async () => {
        try {
            const [categories] = await this.conex.query(
                'SELECT DISTINCT category FROM inventory WHERE category IS NOT NULL ORDER BY category'
            );
            return categories.map(cat => cat.category);
        } catch (error) {
            throw { status: 500, message: 'Error al obtener las categorías', cause: error };
        }
    };

    // Obtener ubicaciones únicas
    getLocations = async () => {
        try {
            const [locations] = await this.conex.query(
                'SELECT DISTINCT location FROM inventory WHERE location IS NOT NULL ORDER BY location'
            );
            return locations.map(loc => loc.location);
        } catch (error) {
            throw { status: 500, message: 'Error al obtener las ubicaciones', cause: error };
        }
    };
}

export default InventarioService;