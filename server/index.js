const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./config/swaggerConfig");
const routes = require("./routes");
const cors = require("cors");
const morganMiddleware = require("./middleware/morganMiddleware");
const logger = require("./config/logger");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morganMiddleware);

// Serve Swagger documentation
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Use API routes
app.use("/api/v1", routes);

app.use((err, req, res, next) => {
	logger.error(`Error occurred: ${err.message}`);
	res.status(500).send("Internal Server Error");
});

app.post("/api/webhook", require("./utils/lineWebhookHandler"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on PORT ${PORT}.`);
	console.log(`Api are available at http://localhost:${PORT}/api/v1`);
	console.log(
		`Swagger docs are available at http://localhost:${PORT}/api/docs`
	);
});
