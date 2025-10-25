class RolesService {
    constructor(conex) {
        this.conex = conex;
    }

    // Crear nuevo rol
    createRole = async (roleData) => {
        try {
            const { name } = roleData;
            
            const [result] = await this.conex.query(
                'INSERT INTO roles (name) VALUES (?)',
                [name]
            );

            return {
                id_role: result.insertId,
                name
            };
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw { status: 409, message: 'Ya existe un rol con ese nombre' };
            }
            throw { status: 500, message: 'Error al crear el rol', cause: error };
        }
    };

    // Obtener todos los roles
    getAllRoles = async () => {
        try {
            const [roles] = await this.conex.query(
                'SELECT * FROM roles ORDER BY name ASC'
            );
            return roles;
        } catch (error) {
            throw { status: 500, message: 'Error al obtener los roles', cause: error };
        }
    };

    // Obtener rol por ID
    getRoleById = async (id) => {
        try {
            const [roles] = await this.conex.query(
                'SELECT * FROM roles WHERE id_role = ?',
                [id]
            );

            if (roles.length === 0) {
                throw { status: 404, message: 'Rol no encontrado' };
            }

            return roles[0];
        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: 'Error al obtener el rol', cause: error };
        }
    };

    // Actualizar rol
    updateRole = async (id, roleData) => {
        try {
            const { name } = roleData;

            const [result] = await this.conex.query(
                'UPDATE roles SET name = ? WHERE id_role = ?',
                [name, id]
            );

            if (result.affectedRows === 0) {
                throw { status: 404, message: 'Rol no encontrado' };
            }

            return await this.getRoleById(id);
        } catch (error) {
            if (error.status) throw error;
            if (error.code === 'ER_DUP_ENTRY') {
                throw { status: 409, message: 'Ya existe un rol con ese nombre' };
            }
            throw { status: 500, message: 'Error al actualizar el rol', cause: error };
        }
    };

    // Eliminar rol
    deleteRole = async (id) => {
        try {
            // Verificar si el rol tiene usuarios asociados
            const [users] = await this.conex.query(
                'SELECT COUNT(*) as count FROM users WHERE id_role = ?',
                [id]
            );

            if (users[0].count > 0) {
                throw { status: 409, message: 'No se puede eliminar el rol porque tiene usuarios asociados' };
            }

            const [result] = await this.conex.query(
                'DELETE FROM roles WHERE id_role = ?',
                [id]
            );

            if (result.affectedRows === 0) {
                throw { status: 404, message: 'Rol no encontrado' };
            }

            return { message: 'Rol eliminado correctamente' };
        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: 'Error al eliminar el rol', cause: error };
        }
    };

    // Obtener usuarios por rol
    getUsersByRole = async (roleId) => {
        try {
            const [users] = await this.conex.query(`
                SELECT u.id_user, u.name, u.email, u.active, r.name as role_name
                FROM users u
                JOIN roles r ON u.id_role = r.id_role
                WHERE u.id_role = ?
                ORDER BY u.name ASC
            `, [roleId]);

            return users;
        } catch (error) {
            throw { status: 500, message: 'Error al obtener los usuarios del rol', cause: error };
        }
    };

    // Obtener estadísticas de roles
    getRolesStats = async () => {
        try {
            const [stats] = await this.conex.query(`
                SELECT 
                    r.id_role,
                    r.name,
                    COUNT(u.id_user) as user_count,
                    SUM(CASE WHEN u.active = 1 THEN 1 ELSE 0 END) as active_users
                FROM roles r
                LEFT JOIN users u ON r.id_role = u.id_role
                GROUP BY r.id_role, r.name
                ORDER BY r.name ASC
            `);

            return stats;
        } catch (error) {
            throw { status: 500, message: 'Error al obtener las estadísticas de roles', cause: error };
        }
    };
}

export default RolesService;