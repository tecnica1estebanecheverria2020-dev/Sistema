import pino from 'pino';

const pinoLogger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport: process.env.NODE_ENV !== 'production'
    ? {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:HH:MM:ss',
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
      body: method === 'GET' ? undefined : (url.includes('/login') ? { ...body, password: '[Hidden]' } : body)
    };

    const msg = `[${res.statusCode}] ${method} ${url} - ${duration}ms`;

    // Logs según el tipo de respuesta
    if (res.statusCode >= 500) {
      pinoLogger.error(logData, msg);
    } else if (res.statusCode >= 400) {
      pinoLogger.warn(logData, msg);
    } else {
      pinoLogger.info(logData, msg);
    }
  });

  next();
};

export default logger;