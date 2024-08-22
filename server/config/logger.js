const fs = require("fs");
const path = require("path");
const { createLogger, format, transports } = require("winston");

const logDir = path.join(__dirname, "log");

// Create log directory if it does not exist and if in development
if (process.env.NODE_ENV === "development") {
	if (!fs.existsSync(logDir)) {
		fs.mkdirSync(logDir, { recursive: true });
	}
}

// Create a logger instance
const logger = createLogger({
	level: "info",
	format: format.combine(
		format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
		format.printf(
			({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`
		)
	),
	transports: [
		// Console transport for all environments
		new transports.Console({
			format: format.combine(format.colorize(), format.simple()),
		}),
	],
});

// Add file transport only in development
if (process.env.NODE_ENV === "development") {
	logger.add(new transports.File({ filename: path.join(logDir, "app.log") }));
}

module.exports = logger;
