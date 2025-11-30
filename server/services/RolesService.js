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
            // Verificar si el rol tiene usuarios asociados en la tabla puente users_roles
            const [users] = await this.conex.query(
                'SELECT COUNT(*) as count FROM users_roles WHERE id_role = ?',
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

    // Obtener usuarios por rol usando la tabla users_roles
    getUsersByRole = async (roleId) => {
        try {
            const [users] = await this.conex.query(`
                SELECT u.id_user, u.name, u.email, u.active, r.name as role_name
                FROM users u
                JOIN users_roles ur ON u.id_user = ur.id_user
                JOIN roles r ON ur.id_role = r.id_role
                WHERE ur.id_role = ?
                ORDER BY u.name ASC
            `, [roleId]);

            return users;
        } catch (error) {
            throw { status: 500, message: 'Error al obtener los usuarios del rol', cause: error };
        }
    };

    // Obtener usuarios por nombre de rol usando la tabla users_roles
    getUsersByRoleName = async (roleName) => {
        try {
            const [users] = await this.conex.query(`
                SELECT u.id_user, u.name, u.email, u.active, r.name as role_name
                FROM users u
                JOIN users_roles ur ON u.id_user = ur.id_user
                JOIN roles r ON ur.id_role = r.id_role
                WHERE LOWER(r.name) = LOWER(?)
                ORDER BY u.name ASC
            `, [roleName]);

            return users;
        } catch (error) {
            throw { status: 500, message: 'Error al obtener los usuarios por nombre de rol', cause: error };
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

    // Obtener roles de un usuario usando tabla puente users_roles
    getUserRoles = async (userId) => {
        try {
            const [[userExists]] = await this.conex.query('SELECT 1 as ok FROM users WHERE id_user = ?', [userId]);
            if (!userExists) {
                throw { status: 404, message: 'Usuario no encontrado' };
            }
            const [roles] = await this.conex.query(
                `SELECT r.id_role, r.name
                 FROM users_roles ur
                 JOIN roles r ON ur.id_role = r.id_role
                 WHERE ur.id_user = ?
                 ORDER BY r.name ASC`,
                [userId]
            );
            return roles;
        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: 'Error al obtener roles del usuario', cause: error };
        }
    };

    // Asignar roles a un usuario: inserta los no existentes, ignora duplicados
    assignRolesToUser = async (userId, roles) => {
        const conn = this.conex;
        try {
            // Validar usuario
            const [[userExists]] = await conn.query('SELECT 1 as ok FROM users WHERE id_user = ?', [userId]);
            if (!userExists) throw { status: 404, message: 'Usuario no encontrado' };

            // Normalizar ids
            const roleIds = [...new Set(roles.map((r) => Number(r)).filter((n) => !isNaN(n)))];
            if (roleIds.length === 0) throw { status: 400, message: 'Lista de roles inválida' };

            // Validar roles existentes
            const [existing] = await conn.query(
                `SELECT id_role FROM roles WHERE id_role IN (${roleIds.map(() => '?').join(',')})`,
                roleIds
            );
            const existingIds = existing.map((r) => Number(r.id_role));
            if (existingIds.length === 0) throw { status: 400, message: 'Ninguno de los roles existe' };

            // Insertar ignorando duplicados
            if (existingIds.length > 0) {
                const values = existingIds.map((id) => [userId, id]);
                await conn.query(
                    'INSERT IGNORE INTO users_roles (id_user, id_role) VALUES ' +
                    values.map(() => '(?, ?)').join(','),
                    values.flat()
                );
            }

            return await this.getUserRoles(userId);
        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: 'Error al asignar roles al usuario', cause: error };
        }
    };

    // Remover roles de un usuario: si lista vacía, remueve todos
    removeRolesFromUser = async (userId, roles) => {
        const conn = this.conex;
        try {
            const [[userExists]] = await conn.query('SELECT 1 as ok FROM users WHERE id_user = ?', [userId]);
            if (!userExists) throw { status: 404, message: 'Usuario no encontrado' };

            const roleIds = Array.isArray(roles)
                ? [...new Set(roles.map((r) => Number(r)).filter((n) => !isNaN(n)))]
                : [];

            if (roleIds.length === 0) {
                // Remover todos
                await conn.query('DELETE FROM users_roles WHERE id_user = ?', [userId]);
            } else {
                await conn.query(
                    `DELETE FROM users_roles WHERE id_user = ? AND id_role IN (${roleIds.map(() => '?').join(',')})`,
                    [userId, ...roleIds]
                );
            }

            return await this.getUserRoles(userId);
        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: 'Error al remover roles del usuario', cause: error };
        }
    };
}

export default RolesService;
