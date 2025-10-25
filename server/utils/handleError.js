import Log from "./log.js";

export default function handleError(res, err) {
  // Si el error es un string, convertirlo a objeto
  if (typeof err === 'string') {
    err = { message: err, status: 500 };
  }

  const status = err.status || 500;
  const message = err.message || 'Error interno del servidor';

  // Errores internos (500+) - mostrar mensaje genérico al cliente
  if (status >= 500) {
    // Log.error(`[${status}] Error interno: ${message}`);
    // Log.error(err);
    console.error(err);
    return res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
    });
  }

  if (status === 429) {
    return res.status(429).json({
      success: false,
      message: 'Demasiadas solicitudes, por favor intenta más tarde.'
    });
  }

  // Errores de cliente (400-499) - mostrar mensaje personalizado
  Log.warn(`[${status}] ${message}`);
  return res.status(status).json({
    success: false,
    message
  });
}