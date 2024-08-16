const express = require("express");
const router = express.Router();
const {
	AddPatient,
	EditPatient,
	FindPatient,
	DelPatient,
} = require("../controllers/patientController");

/**
 * @swagger
 * tags:
 *   name: Patients
 *   description: Operations related to Patients
 */

/**
 * @swagger
 * /api/v1/patient:
 *   post:
 *     summary: Add a new patient
 *     description: Adds a new patient record to the system.
 *     tags:
 *       - Patients
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               HN:
 *                 type: string
 *                 description: Hospital Number (HN) of the patient.
 *                 example: 'AI12345'
 *               prefix:
 *                 type: string
 *                 description: Prefix of the patient's name (e.g., Mr., Mrs.).
 *                 example: 'Mr.'
 *               name:
 *                 type: string
 *                 description: First name of the patient.
 *                 example: 'John'
 *               surname:
 *                 type: string
 *                 description: Surname of the patient.
 *                 example: 'Doe'
 *               gender:
 *                 type: string
 *                 description: Gender of the patient.
 *                 example: 'Male'
 *               DOB:
 *                 type: string
 *                 format: date
 *                 description: Date of birth of the patient.
 *                 example: '1990-01-01'
 *             required:
 *               - HN
 *               - prefix
 *               - name
 *               - surname
 *               - gender
 *               - DOB
 *     responses:
 *       200:
 *         description: Patient added successfully
 *       500:
 *         description: Internal server error
 */
router.post("/patient", AddPatient);

/**
 * @swagger
 * /api/v1/patient/{HN}:
 *   put:
 *     summary: Edit an existing patient
 *     description: Updates details of an existing patient identified by Hospital Number (HN).
 *     tags:
 *       - Patients
 *     parameters:
 *       - in: path
 *         name: HN
 *         required: true
 *         schema:
 *           type: string
 *           example: "AI123456"
 *         description: Hospital Number (HN) of the patient.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prefix:
 *                 type: string
 *                 description: Prefix of the patient's name (e.g., Mr., Mrs.).
 *                 example: 'Mr.'
 *               name:
 *                 type: string
 *                 description: First name of the patient.
 *                 example: 'John'
 *               surname:
 *                 type: string
 *                 description: Surname of the patient.
 *                 example: 'Doe'
 *               gender:
 *                 type: string
 *                 description: Gender of the patient.
 *                 example: 'Male'
 *               DOB:
 *                 type: string
 *                 format: date
 *                 description: Date of birth of the patient, must be in "YYYY-MM-DD" format.
 *                 example: '1990-01-01'
 *             required:
 *               - prefix
 *               - name
 *               - surname
 *               - gender
 *               - DOB
 *     responses:
 *       200:
 *         description: Patient updated successfully
 *       500:
 *         description: Internal server error
 */
router.put("/patient/:HN", EditPatient);

/**
 * @swagger
 * /api/v1/patient/{HN}:
 *   get:
 *     summary: Find a patient by HN
 *     description: Retrieves a patient record by the specified Hospital Number (HN). If HN is not provided, retrieves a list of patients.
 *     tags:
 *       - Patients
 *     parameters:
 *       - in: path
 *         name: HN
 *         schema:
 *           type: string
 *           example: "AI123456"
 *           nullable: true
 *         description: Hospital Number (HN) of the patient. If not provided, the endpoint returns the latest updated patients.
 *     responses:
 *       200:
 *         description: Patient data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The document ID of the patient in Firestore.
 *                     example: abc123
 *                   HN:
 *                     type: string
 *                     description: Hospital Number of the patient.
 *                     example: 12345
 *                   prefix:
 *                     type: string
 *                     description: Prefix of the patient's name.
 *                     example: Mr.
 *                   name:
 *                     type: string
 *                     description: First name of the patient.
 *                     example: John
 *                   surname:
 *                     type: string
 *                     description: Surname of the patient.
 *                     example: Doe
 *                   gender:
 *                     type: string
 *                     description: Gender of the patient.
 *                     example: Male
 *                   DOB:
 *                     type: string
 *                     format: date
 *                     description: Date of birth of the patient.
 *                     example: 1990-01-01
 *                   lastUpdate:
 *                     type: string
 *                     format: date-time
 *                     description: The timestamp of the last update for the patient record.
 *                     example: 2024-08-08T12:34:56Z
 *       500:
 *         description: Internal server error
 */
router.get("/patient/:HN", FindPatient);

/**
 * @swagger
 * /api/v1/patient/{HN}:
 *   delete:
 *     summary: Delete a patient's information
 *     description: Delete an existing document from a patient's information collection using the Hospital Number (HN).
 *     tags:
 *       - Patients
 *     parameters:
 *       - in: path
 *         name: HN
 *         required: true
 *         schema:
 *           type: string
 *           example: "AI123456"
 *         description: Hospital Number (HN) of the patient.
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
router.delete("/patient/:HN", DelPatient);

module.exports = router;
