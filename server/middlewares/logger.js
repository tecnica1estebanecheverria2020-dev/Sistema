import pino from 'pino';

const pinoLogger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport: process.env.NODE_ENV !== 'production'
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname'
        }
      }
    : undefined
});

// Middleware de logging (Imprimir en consola)
const logger = (req, res, next) => {
  if (req.method === 'OPTIONS') return next();

  const start = Date.now();
  const { method, url, body } = req;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
        url,
        method,
        status: res.statusCode,
        duration: `${duration}ms`,
        body: method === 'GET' ? undefined : body
    };

    // Logs según el tipo de respuesta
    if (res.statusCode >= 500) {
      pinoLogger.error(logData, 'Error en la solicitud');
    } else if (res.statusCode >= 400) {
      pinoLogger.warn(logData, 'Solicitud con advertencia');
    } else {
      pinoLogger.info(logData, 'Solicitud procesada correctamente');
    }
  });

  next();
};

export default logger;