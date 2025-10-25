import { verifyToken } from '../utils/jwt.js';
import pool from '../db/conex.js';

export async function requireAuth(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No autorizado'
    });
  }

  try {
    const decoded = verifyToken(token);

    const [isDesactivated] = await pool.query('SELECT active FROM users WHERE id_user = ?', [decoded.id_user]);
    if (!isDesactivated[0].active) {
      return res.status(403).json({
        success: false,
        message: 'Tu cuenta ha sido desactivada'
      });
    }

    req.user = decoded; // disponible en el controlador
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: 'Token inválido o expirado'
    });
  }
}