import winston from 'winston';
import path from 'path';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Tell winston that you want to link the colors
winston.addColors(colors);

// Choose the aspect of your log customizing the log format
const format = winston.format.combine(
  // Add the message timestamp with the preferred format
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  // Tell Winston that the logs must be colored
  winston.format.colorize({ all: true }),
  // Define the format of the message showing the timestamp, the level and the message
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// Define which transports the logger must use to print out messages
const transports = [
  // Allow the use the console to print the messages
  new winston.transports.Console(),
  // Allow to print all the error level messages inside the error.log file
  new winston.transports.File({
    filename: path.join(process.cwd(), 'logs', 'error.log'),
    level: 'error',
  }),
  // Allow to print all the error message inside the all.log file
  new winston.transports.File({
    filename: path.join(process.cwd(), 'logs', 'all.log'),
  }),
];

// Create the logger instance that has to be exported
// and used to log messages.
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'warn',
  levels,
  format,
  transports,
  // Do not exit on handled exceptions
  exitOnError: false,
});

// Create a stream object with a 'write' function that will be used by morgan
export const loggerStream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

// Helper functions for different log levels
export const logError = (message: string, error?: any) => {
  if (error) {
    logger.error(`${message} - ${error.message || error}`, {
      stack: error.stack,
      ...error,
    });
  } else {
    logger.error(message);
  }
};

export const logWarn = (message: string, meta?: any) => {
  logger.warn(message, meta);
};

export const logInfo = (message: string, meta?: any) => {
  logger.info(message, meta);
};

export const logHttp = (message: string, meta?: any) => {
  logger.http(message, meta);
};

export const logDebug = (message: string, meta?: any) => {
  logger.debug(message, meta);
};

// Export the main logger instance
export default logger;
