const logger = require("../config/logger");
const { performance } = require("perf_hooks");

function logRequest(targetFunction) {
  return async function (req, res, ...args) {
    const { method, url, body, params, query } = req;
    logger.info(
      `Request received: ${method} ${url} - Params: ${JSON.stringify(
        params
      )} - Query: ${JSON.stringify(query)} - Body: ${JSON.stringify(body)}`
    );
    try {
      await targetFunction(req, res, ...args);
    } catch (error) {
      logger.error(
        `Error processing request: ${method} ${url} - ${error.message}`
      );
      throw error;
    }
  };
}

function timeExecution(targetFunction) {
  return async function (req, res, ...args) {
    const startTime = performance.now();
    await targetFunction(req, res, ...args);
    const endTime = performance.now();
    logger.info(
      `Execution time for ${req.method} ${req.url}: ${endTime - startTime}ms`
    );
  };
}

module.exports = { logRequest, timeExecution };
