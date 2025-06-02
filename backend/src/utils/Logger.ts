import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, errors } = format;

// Custom format for log messages
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

const LogErrors = createLogger({
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }), // To include stack trace
    logFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'app_error.log' }),
  ],
});

class Logger {
  logWarning(message: string) {
    throw new Error('Method not implemented.' + message);
  }
  async logInfo(message: string) {
    LogErrors.info(message);
  }

  async logError(err: any) {
    LogErrors.error(`${new Date()} - ${JSON.stringify(err)}`);
    return false;
  }

  async logMany(messages: string[]) {
    messages.forEach((message) => {
      LogErrors.info(message);
    });
  }
}

export default new Logger();
