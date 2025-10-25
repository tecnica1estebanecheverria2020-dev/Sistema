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

class Log {
    constructor(pino) {
        this.logger = pino;
    }

    info(msg) {
        this.logger.info(msg);
    }

    error(msg) {
        this.logger.error(msg);
    }

    warn(msg) {
        this.logger.warn(msg);
    }

    debug(msg) {
        this.logger.debug(msg);
    }

    fatal(msg) {
        this.logger.fatal(msg);
    }
}

export default new Log(pinoLogger);