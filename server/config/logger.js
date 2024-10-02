// logger.js
const winston = require("winston");
const path = require("path");
const fs = require("fs");

// Create log folder if it doesn't exist and in development mode
const logDirectory = path.join(__dirname, "../log");

if (
  process.env.NODE_ENV === "development" ||
  process.env.NODE_ENV === "local"
) {
  if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
  }
}

// Format timestamp for log file name
const timestamp = new Date().toISOString().replace(/:/g, "-");
const logFilename = path.join(logDirectory, `${timestamp}.log`);

// Configure winston logger
const transports = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} ${level}: ${message}`;
      })
    ),
  }),
];

if (
  process.env.NODE_ENV === "development" ||
  process.env.NODE_ENV === "local"
) {
  transports.push(new winston.transports.File({ filename: logFilename }));
}

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  transports,
});

module.exports = logger;

//แก้
