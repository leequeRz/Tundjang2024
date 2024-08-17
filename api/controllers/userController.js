const crypto = require("crypto");
const { db } = require("../config/firebaseConfig");
const logger = require("../config/logger");
const { checkField } = require("../utils");
const {
	logRequest,
	timeExecution,
} = require("../middleware/performanceMiddleware");

const multer = require("multer");

function hashData(data) {
	return crypto.createHash("sha512").update(data).digest("hex");
}

// Create new user
const create = logRequest(
	timeExecution(async (req, res) => {
		try {
			const requiredFields = ["password", "username", "user_type"];

			if (!checkField(requiredFields, req, res)) {
				return;
			}

			const userData = {
				username: req.body.username,
				password: hashData(req.body.password),
				user_type: req.body.user_type,
			};

			await db.collection("users").doc(req.body.username).create(userData);

			logger.info(`User created successfully: ${req.body.username}`); // Log success
			res.status(200).send("Register user success");
		} catch (error) {
			logger.error(
				`Error creating user ${req.body.username}: ${error.message}`
			); // Log error
			res.status(500).send(error.message);
		}
	})
);

// Log in user
const login = logRequest(
	timeExecution(async (req, res) => {
		try {
			const requiredFields = ["username", "password"];

			if (!checkField(requiredFields, req, res)) {
				return;
			}

			const { username, password } = req.body;

			const checkLogin = await db
				.collection("users")
				.where("username", "==", username)
				.where("password", "==", hashData(password))
				.get();

			if (checkLogin.empty) {
				logger.warn(`Login attempt failed for username: ${username}`);
				return res.status(401).send("Wrong username or password");
			}

			logger.info(`User logged in successfully: ${username}`);
			res.status(200).send("success");
		} catch (error) {
			logger.error(
				`Error logging in user ${req.body.username}: ${error.message}`
			);
			res.status(500).send(error.message);
		}
	})
);

// Edit user
const edit = logRequest(
	timeExecution(async (req, res) => {
		// Add implementation for editing user and integrate logging similarly
	})
);

// Delete user
const del = logRequest(
	timeExecution(async (req, res) => {
		try {
			const requiredFields = ["username", "password"];

			if (!checkField(requiredFields, req, res)) {
				return;
			}

			await db
				.collection("users")
				.where("username", "==", req.body.username)
				.where("password", "==", hashData(req.body.password))
				.delete();

			logger.info(`User deleted successfully: ${req.body.username}`); // Log success
			res.status(200).send("delete success");
		} catch (error) {
			logger.error(
				`Error deleting user ${req.body.username}: ${error.message}`
			); // Log error
			res.status(500).send(error.message);
		}
	})
);

module.exports = { create, login, edit, del };
