import handleError from '../utils/handleError.js';

class RolesController {
    constructor(rolesService) {
        this.rolesService = rolesService;
    }

    // Crear nuevo rol
    createRole = async (req, res) => {
        try {
            const { name } = req.body;

            // Validaciones
            if (!name || name.trim() === '') {
                return res.status(400).json({ 
                    success: false, 
                    message: 'El nombre del rol es requerido' 
                });
            }

            if (name.length < 2 || name.length > 50) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'El nombre del rol debe tener entre 2 y 50 caracteres' 
                });
            }

            const roleData = { name: name.trim() };
            const newRole = await this.rolesService.createRole(roleData);

            res.status(201).json({
                success: true,
                message: 'Rol creado exitosamente',
                data: newRole
            });
        } catch (error) {
            handleError(res, error);
        }
    };

    // Obtener todos los roles
    getAllRoles = async (req, res) => {
        try {
            const roles = await this.rolesService.getAllRoles();

            res.status(200).json({
                success: true,
                message: 'Roles obtenidos exitosamente',
                data: roles
            });
        } catch (error) {
            handleError(res, error);
        }
    };

    // Obtener rol por ID
    getRoleById = async (req, res) => {
        try {
            const { id } = req.params;

            if (!id || isNaN(id)) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'ID de rol inválido' 
                });
            }

            const role = await this.rolesService.getRoleById(id);

            res.status(200).json({
                success: true,
                message: 'Rol obtenido exitosamente',
                data: role
            });
        } catch (error) {
            handleError(res, error);
        }
    };

    // Actualizar rol
    updateRole = async (req, res) => {
        try {
            const { id } = req.params;
            const { name } = req.body;

            // Validaciones
            if (!id || isNaN(id)) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'ID de rol inválido' 
                });
            }

            if (!name || name.trim() === '') {
                return res.status(400).json({ 
                    success: false, 
                    message: 'El nombre del rol es requerido' 
                });
            }

            if (name.length < 2 || name.length > 50) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'El nombre del rol debe tener entre 2 y 50 caracteres' 
                });
            }

            const roleData = { name: name.trim() };
            const updatedRole = await this.rolesService.updateRole(id, roleData);

            res.status(200).json({
                success: true,
                message: 'Rol actualizado exitosamente',
                data: updatedRole
            });
        } catch (error) {
            handleError(res, error);
        }
    };

    // Eliminar rol
    deleteRole = async (req, res) => {
        try {
            const { id } = req.params;

            if (!id || isNaN(id)) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'ID de rol inválido' 
                });
            }

            const result = await this.rolesService.deleteRole(id);

            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            handleError(res, error);
        }
    };

    // Obtener usuarios por rol
    getUsersByRole = async (req, res) => {
        try {
            const { id } = req.params;

            if (!id || isNaN(id)) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'ID de rol inválido' 
                });
            }

            const users = await this.rolesService.getUsersByRole(id);

            res.status(200).json({
                success: true,
                message: 'Usuarios del rol obtenidos exitosamente',
                data: users
            });
        } catch (error) {
            handleError(res, error);
        }
    };

    // Obtener estadísticas de roles
    getRolesStats = async (req, res) => {
        try {
            const stats = await this.rolesService.getRolesStats();

            res.status(200).json({
                success: true,
                message: 'Estadísticas de roles obtenidas exitosamente',
                data: stats
            });
        } catch (error) {
            handleError(res, error);
        }
    };
}

export default RolesController;