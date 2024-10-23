const express = require("express");
const router = express.Router();
const {
  AddCustomer,
  EditCustomer,
  FindCustomer,
  DelCustomer,
} = require("../controllers/customerController");

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Operations related to Customers
 */

/**
 * @swagger
 * /api/v1/customer:
 *   post:
 *     summary: Add a new customer
 *     description: Adds a new customer record to the system.
 *     tags:
 *       - Customers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customer_id:
 *                 type: string
 *                 description: Customer ID (customer_id) of the customer.
 *                 example: 'AI12345'
 *               prefix:
 *                 type: string
 *                 description: Prefix of the customer's name (e.g., Mr., Mrs.).
 *                 example: 'Mr.'
 *               name:
 *                 type: string
 *                 description: First name of the customer.
 *                 example: 'John'
 *               surname:
 *                 type: string
 *                 description: Surname of the customer.
 *                 example: 'Doe'
 *               gender:
 *                 type: string
 *                 description: Gender of the customer.
 *                 example: 'Male'
 *               DOB:
 *                 type: string
 *                 format: date
 *                 description: Date of birth of the customer.
 *                 example: '1990-01-01'
 *             required:
 *               - customer_id
 *               - customer
 *               - name
 *               - surname
 *               - gender
 *               - DOB
 *     responses:
 *       200:
 *         description: customer added successfully
 *       500:
 *         description: Internal server error
 */
router.post("/customer", AddCustomer);

/**
 * @swagger
 * /api/v1/customer/{customer_id}:
 *   put:
 *     summary: Edit an existing customer
 *     description: Updates details of an existing customer identified by Hospital Number (HN).
 *     tags:
 *       - Customers
 *     parameters:
 *       - in: path
 *         name: HN
 *         required: true
 *         schema:
 *           type: string
 *           example: "AI123456"
 *         description: Hospital Number (HN) of the customer.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prefix:
 *                 type: string
 *                 description: Prefix of the customer's name (e.g., Mr., Mrs.).
 *                 example: 'Mr.'
 *               name:
 *                 type: string
 *                 description: First name of the customer.
 *                 example: 'John'
 *               surname:
 *                 type: string
 *                 description: Surname of the customer.
 *                 example: 'Doe'
 *               gender:
 *                 type: string
 *                 description: Gender of the customer.
 *                 example: 'Male'
 *               DOB:
 *                 type: string
 *                 format: date
 *                 description: Date of birth of the customer, must be in "YYYY-MM-DD" format.
 *                 example: '1990-01-01'
 *             required:
 *               - prefix
 *               - name
 *               - surname
 *               - gender
 *               - DOB
 *     responses:
 *       200:
 *         description: Customer updated successfully
 *       500:
 *         description: Internal server error
 */
router.put("/customer/:customer_id", EditCustomer);

/**
 * @swagger
 * /api/v1/customer/{customer_id}:
 *   get:
 *     summary: Find a customer by customer_id
 *     description: Retrieves a customer record by the specified Hospital Number (HN). If HN is not provided, retrieves a list of customers.
 *     tags:
 *       - Customers
 *     parameters:
 *       - in: query
 *         name: HN
 *         schema:
 *           type: string
 *         required: false
 *         description: Hospital Number (HN) of the customer. If not provided, returns all customers.
 *     responses:
 *       200:
 *         description: Customer data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The document ID of the customer in Firestore.
 *                     example: abc123
 *                   customer_id:
 *                     type: string
 *                     description: Customer ID of the customer.
 *                     example: 12345
 *                   prefix:
 *                     type: string
 *                     description: Prefix of the customer's name.
 *                     example: Mr.
 *                   name:
 *                     type: string
 *                     description: First name of the customer.
 *                     example: John
 *                   surname:
 *                     type: string
 *                     description: Surname of the customer.
 *                     example: Doe
 *                   gender:
 *                     type: string
 *                     description: Gender of the customer.
 *                     example: Male
 *                   DOB:
 *                     type: string
 *                     format: date
 *                     description: Date of birth of the customer.
 *                     example: 1990-01-01
 *                   lastUpdate:
 *                     type: string
 *                     format: date-time
 *                     description: The timestamp of the last update for the customer record.
 *                     example: 2024-08-08T12:34:56Z
 *       500:
 *         description: Internal server error
 */
router.get("/customer", FindCustomer);

/**
 * @swagger
 * /api/v1/customer/{customer_id}:
 *   delete:
 *     summary: Delete a customer's information
 *     description: Delete an existing document from a customer's information collection using the Customer ID (customer_id).
 *     tags:
 *       - Customers
 *     parameters:
 *       - in: path
 *         name: customer_id
 *         required: true
 *         schema:
 *           type: string
 *           example: "AI123456"
 *         description: Customer ID (customer_id) of the customer.
 *     responses:
 *       200:
 *         description: Record deleted successfully.
 *       500:
 *         description: Internal server error.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Error message
 */
router.delete("/customer/:customer_id", DelCustomer);

module.exports = router;
