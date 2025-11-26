import bcrypt from 'bcrypt';

class AuthService {
    constructor(conex) {
        this.conex = conex
    }

    hashPassword = async (password) => {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    };

    comparePassword = async (password, hashedPassword) => {
        return await bcrypt.compare(password, hashedPassword);
    };

    createUser = async (userData) => {
        const { name, email, password, roles = [] } = userData;
        const hashedPassword = await this.hashPassword(password);
        const normalizedEmail = email.toLowerCase().trim();

        const [login] = await this.conex.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, normalizedEmail, hashedPassword]
        );

        // Insertar relaciones de roles si se proporcionan como objetos { id_role, name }
        if (Array.isArray(roles) && roles.length > 0) {
            const roleIds = Array.from(new Set(
                roles.map(r => Number(r?.id_role)).filter(Boolean)
            ));

            if (roleIds.length > 0) {
                // Validar que los roles existan
                const [validRoles] = await this.conex.query(
                    `SELECT id_role, name FROM roles WHERE id_role IN (${roleIds.map(() => '?').join(',')})`,
                    roleIds
                );
                const validSet = new Set(validRoles.map(r => r.id_role));
                const invalid = roleIds.filter(id => !validSet.has(id));
                if (invalid.length > 0) {
                    throw { status: 400, message: `Roles inválidos: ${invalid.join(',')}` };
                }

                for (const rid of roleIds) {
                    await this.conex.query('INSERT INTO users_roles (id_user, id_role) VALUES (?, ?)', [login.insertId, rid]);
                }
            }
        }

        // Obtener roles del usuario en formato de objetos
        const [userRoles] = await this.conex.query(
            'SELECT r.id_role, r.name FROM users_roles ur JOIN roles r ON ur.id_role = r.id_role WHERE ur.id_user = ?',
            [login.insertId]
        );

        return {
            id_user: login.insertId,
            name,
            email: normalizedEmail,
            roles: userRoles.map(r => ({ id_role: r.id_role, name: r.name }))
        };
    }

    loginUser = async (credentials) => {
        try {
            const { email, password } = credentials;
            const normalizedEmail = email.toLowerCase().trim();

            const [login] = await this.conex.query(
                'SELECT * FROM users  WHERE email = ? AND active = 1',
                [normalizedEmail]
            );

            if (login.length === 0) {
                throw { status: 401, message: 'Credenciales incorrectas o cuenta desactivada' };
            }

            const user = login[0];

            // Verificar si la cuenta está bloqueada
            if (user.lock_until && new Date() < new Date(user.lock_until)) {
                throw { status: 423, message: 'Cuenta bloqueada temporalmente. Intenta más tarde.' };
            }

            const isPasswordValid = await this.comparePassword(password, user.password);

            if (!isPasswordValid) {
                // Incrementar intentos fallidos
                const newFailedAttempts = (user.failed_attempts || 0) + 1;
                let lockedUntil = null;

                if (newFailedAttempts >= 5) {
                    lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos
                }

                await this.conex.query(
                    'UPDATE users SET failed_attempts = ?, lock_until = ? WHERE id_user = ?',
                    [newFailedAttempts, lockedUntil, user.id_user]
                );

                throw { status: 401, message: 'Credenciales incorrectas' };
            }

            // Resetear intentos fallidos en login exitoso
            await this.conex.query(
                'UPDATE users SET failed_attempts = 0, lock_until = NULL WHERE id_user = ?',
                [user.id_user]
            );

            // Obtener todos los roles asociados al usuario
            const [userRoles] = await this.conex.query(
                'SELECT r.id_role, r.name FROM users_roles ur ' +
                'JOIN roles r ON ur.id_role = r.id_role WHERE ur.id_user = ?',
                [user.id_user]
            );

            return {
                id_user: user.id_user,
                roles: userRoles.map(r => ({ id_role: r.id_role, name: r.name })),
                email: user.email,
                name: user.name,
            }
        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: 'Error interno del servidor', cause: error };
        }
    };
}

export default AuthService;
