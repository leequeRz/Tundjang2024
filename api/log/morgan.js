// morgan.js
const morgan = require("morgan");
const logger = require("./logger");

const stream = {
	write: (message) => logger.http(message.trim()),
};

const morganMiddleware = morgan("combined", { stream });

module.exports = morganMiddleware;
