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
 *               prefix:
 *                 type: string
 *               name:
 *                 type: string
 *               surname:
 *                 type: string
 *               gender:
 *                 type: string
 *               DOB:
 *                 type: string
 *                 format: date
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
 *               name:
 *                 type: string
 *               surname:
 *                 type: string
 *               gender:
 *                 type: string
 *               DOB:
 *                 type: string
 *                 format: date
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
 *         description: Hospital Number (HN) of the patient.
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
 *                   HN:
 *                     type: string
 *                   prefix:
 *                     type: string
 *                   name:
 *                     type: string
 *                   surname:
 *                     type: string
 *                   gender:
 *                     type: string
 *                   DOB:
 *                     type: string
 *                     format: date
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
