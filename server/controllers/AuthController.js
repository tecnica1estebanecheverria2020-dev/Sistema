import handleError from '../utils/handleError.js';
import { generateToken } from '../utils/jwt.js';

class AuthController {
    constructor(authService) {
        this.service = authService;
    }

    // No creo que sea necesario un registro, la creacion de usuarios lo controlaria el admin
    createUser = async (req, res) => {
        const { name, email, password, id_role } = req.body;
        try {
            if (!name || !email || !password || !id_role) {
                throw { status: 400, message: 'Faltan datos para crear el usuario' };
            }

            const user = await this.service.createUser({ name, email, password, id_role });

            res.status(201).json({
                success: true,
                message: 'Usuario creado correctamente',
                user
            });
        } catch (err) {
            return handleError(res, err);
        }
    }

    login = async (req, res) => {
        const { email, password } = req.body;
        try {
            if (!email || !password) {
                throw { status: 400, message: 'Faltan datos para el login' };
            }

            const user = await this.service.loginUser({ email, password });

            const token = generateToken({
                id_user: user.id_user,
                id_role: user.id_role,
                rol_name: user.rol_name,
                email: user.email,
                name: user.name,
            });

            res.cookie('token', token, {
                httpOnly: true,
                secure: true, // usar HTTPS en producción
                sameSite: 'Strict',
                maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
            });

            res.status(200).json({
                success: true,
                message: 'Se inició sesión correctamente',
                user: user 
            });
        } catch (err) {
            return handleError(res, err);
        }
    };

    logout = (req, res) => {
        res.clearCookie('token');
        req.user = null;
        res.status(200).json({
            success: true,
            message: 'Se cerró sesión correctamente',
        });
    };

    me = (req, res) => {
        res.status(200).json({
            success: true,
            message: 'Usuario autenticado',
            user: req.user
        });
    };
}

export default AuthController;