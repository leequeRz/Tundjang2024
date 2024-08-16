const express = require("express");
const router = express.Router();
const { login, create, edit, del } = require("../controllers/userController");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Operations related to user management
 */

/**
 * @swagger
 * /api/v1/users/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user with the provided username, password, and user type.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username of the new user
 *                 example: "johndoe"
 *               password:
 *                 type: string
 *                 description: Password for the new user
 *                 example: "securepassword123"
 *               user_type:
 *                 type: string
 *                 description: Type of user (e.g., admin, regular)
 *                 example: "admin"
 *     responses:
 *       200:
 *         description: User successfully registered
 *       400:
 *         description: Missing required field
 *       500:
 *         description: Internal server error
 */
router.post("/users/register", create);

/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     summary: Log in a user
 *     description: Logs in a user by validating the username and password.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username of the organization account.
 *                 example: "johndoe"
 *               password:
 *                 type: string
 *                 description: Password of the organization account.
 *                 example: "securepassword123"
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Wrong username or password
 *       500:
 *         description: Internal server error
 */
router.post("/users/login", login);

/**
 * @swagger
 * /api/v1/users/update:
 *   put:
 *     summary: Update user information
 *     description: Updates user details. This endpoint is currently not implemented.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username of the organization account.
 *                 example: "johndoe"
 *               password:
 *                 type: string
 *                 description: Password of the organization account.
 *                 example: "securepassword123"
 *               user_type:
 *                 type: string
 *                 description: New type of user (e.g., admin, regular)
 *                 example: "admin"
 *     responses:
 *       200:
 *         description: User successfully updated
 *       400:
 *         description: Missing required field
 *       500:
 *         description: Internal server error
 */
router.put("/users/update", edit);

/**
 * @swagger
 * /api/v1/users/delete:
 *   delete:
 *     summary: Delete a user
 *     description: Deletes a user by validating the username and password.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username of the organization account.
 *                 example: "johndoe"
 *               password:
 *                 type: string
 *                 description: Password of the organization account.
 *                 example: "securepassword123"
 *     responses:
 *       200:
 *         description: User successfully deleted
 *       400:
 *         description: Missing required field
 *       500:
 *         description: Internal server error
 */
router.delete("/users/delete", del);

module.exports = router;
