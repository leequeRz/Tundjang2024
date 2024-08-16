// logger.js
const winston = require("winston");

const { combine, timestamp, printf, errors } = winston.format;

const customFormat = printf(({ level, message, timestamp, stack }) => {
	return `${timestamp} [${level}]: ${stack || message}`;
});

const logger = winston.createLogger({
	level: "info",
	format: combine(timestamp(), errors({ stack: true }), customFormat),
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({ filename: "combined.log" }),
		new winston.transports.File({ filename: "errors.log", level: "error" }),
	],
});

module.exports = logger;
