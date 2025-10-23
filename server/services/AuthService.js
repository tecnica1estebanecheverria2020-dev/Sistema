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

    loginUser = async (credentials) => {
        try {
            const { email, password } = credentials;
            const normalizedEmail = email.toLowerCase().trim();

            const [login] = await this.conex.query(
                'SELECT u.*, r.id_rol, r.name AS rol_name FROM users u ' +
                'JOIN roles r ON u.id_rol = r.id_rol WHERE u.email = ? AND u.active = 1',
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

            const isPasswordValid = await this.comparePassword(password, user.pass);

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

 /*
                user:
                id_user
                id_rol
                email
                name
                password
                lock_until
                failed_attempts
                active
                */

            return {
                id_user: user.id_user,
                id_rol: user.id_rol,
                rol_name: user.rol_name,
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