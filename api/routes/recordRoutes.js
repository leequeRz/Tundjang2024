const express = require("express");
const router = express.Router();
const {
	AddRecord,
	EditRecord,
	DelRecord,
	GetRecord,
} = require("../controllers/recordController");

// AddRecord route for adding a record
/**
 * @swagger
 * tags:
 *   name: Records
 *   description: Operations related to patient records
 */

/**
 * @swagger
 * /api/v1/patient/{HN}/record:
 *   post:
 *     summary: Add a new record for a patient
 *     description: Adds a new record with various health parameters for the patient identified by the Hospital Number (HN).
 *     tags:
 *       - Records
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
 *               BT:
 *                 type: number
 *                 description: Body Temperature
 *               BP:
 *                 type: string
 *                 description: Blood Pressure
 *               HR:
 *                 type: number
 *                 description: Heart Rate
 *               RR:
 *                 type: number
 *                 description: Respiratory Rate
 *               O2sat:
 *                 type: number
 *                 description: Oxygen Saturation
 *               conscious:
 *                 type: string
 *                 description: Consciousness level
 *               breath_pattern:
 *                 type: string
 *                 description: Breath pattern
 *               eat_method:
 *                 type: string
 *                 description: Eating method
 *               food_type:
 *                 type: string
 *                 description: Type of food
 *               food_intake:
 *                 type: string
 *                 description: Food intake
 *               sleep:
 *                 type: string
 *                 description: Sleep details
 *               excretion:
 *                 type: string
 *                 description: Excretion details
 *               extra_symptoms:
 *                 type: string
 *                 description: Extra symptoms (optional)
 *               extra_food:
 *                 type: string
 *                 description: Extra food (optional)
 *               notes:
 *                 type: string
 *                 description: Additional notes (optional)
 *     responses:
 *       200:
 *         description: Record added successfully, returns the document ID
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: rec_20240816123456
 *       400:
 *         description: Missing required parameter or field
 *       500:
 *         description: Internal server error
 */
router.post("/patient/:HN/record", AddRecord);

// EditRecord route for updating a specific record
/**
 * @swagger
 * /api/v1/patient/{HN}/record/{docId}:
 *   put:
 *     summary: Update a specific record
 *     description: Updates a specific record identified by the document ID for the patient identified by the Hospital Number (HN).
 *     tags:
 *       - Records
 *     parameters:
 *       - in: path
 *         name: HN
 *         required: true
 *         schema:
 *           type: string
 *         description: Hospital Number (HN) of the patient.
 *       - in: path
 *         name: docId
 *         required: true
 *         schema:
 *           type: string
 *         description: Document ID of the record to be updated.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               BT:
 *                 type: number
 *                 description: Body Temperature
 *               BP:
 *                 type: string
 *                 description: Blood Pressure
 *               HR:
 *                 type: number
 *                 description: Heart Rate
 *               RR:
 *                 type: number
 *                 description: Respiratory Rate
 *               O2sat:
 *                 type: number
 *                 description: Oxygen Saturation
 *               conscious:
 *                 type: string
 *                 description: Consciousness level
 *               breath_pattern:
 *                 type: string
 *                 description: Breath pattern
 *               eat_method:
 *                 type: string
 *                 description: Eating method
 *               food_type:
 *                 type: string
 *                 description: Type of food
 *               food_intake:
 *                 type: string
 *                 description: Food intake
 *               sleep:
 *                 type: string
 *                 description: Sleep details
 *               excretion:
 *                 type: string
 *                 description: Excretion details
 *               extra_symptoms:
 *                 type: string
 *                 description: Extra symptoms (optional)
 *               extra_food:
 *                 type: string
 *                 description: Extra food (optional)
 *               notes:
 *                 type: string
 *                 description: Additional notes (optional)
 *     responses:
 *       200:
 *         description: Record updated successfully
 *       400:
 *         description: Missing required parameters or fields
 *       500:
 *         description: Internal server error
 */
router.put("/patient/:HN/record/:docId", EditRecord);

// DelRecord route for deleting a specific record
/**
 * @swagger
 * /api/v1/patient/{HN}/record/{docId}:
 *   delete:
 *     summary: Delete a specific record
 *     description: Deletes a specific record identified by the document ID for the patient identified by the Hospital Number (HN).
 *     tags:
 *       - Records
 *     parameters:
 *       - in: path
 *         name: HN
 *         required: true
 *         schema:
 *           type: string
 *         description: Hospital Number (HN) of the patient.
 *       - in: path
 *         name: docId
 *         required: true
 *         schema:
 *           type: string
 *         description: Document ID of the record to be deleted.
 *     responses:
 *       200:
 *         description: Record deleted successfully
 *       400:
 *         description: Missing required parameters
 *       500:
 *         description: Internal server error
 */
router.delete("/patient/:HN/record/:docId", DelRecord);

// GetRecord route for retrieving records of a specific patient
/**
 * @swagger
 * /api/v1/patient/{HN}/record:
 *   get:
 *     summary: Retrieve records for a specific patient
 *     description: Retrieves all records for the patient identified by the Hospital Number (HN).
 *     tags:
 *       - Records
 *     parameters:
 *       - in: path
 *         name: HN
 *         required: true
 *         schema:
 *           type: string
 *         description: Hospital Number (HN) of the patient.
 *     responses:
 *       200:
 *         description: Records retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Record ID
 *                   timestamp:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp of the record
 *                   BT:
 *                     type: number
 *                     description: Body Temperature
 *                   BP:
 *                     type: string
 *                     description: Blood Pressure
 *                   HR:
 *                     type: number
 *                     description: Heart Rate
 *                   RR:
 *                     type: number
 *                     description: Respiratory Rate
 *                   O2sat:
 *                     type: number
 *                     description: Oxygen Saturation
 *                   conscious:
 *                     type: string
 *                     description: Consciousness level
 *                   breath_pattern:
 *                     type: string
 *                     description: Breath pattern
 *                   eat_method:
 *                     type: string
 *                     description: Eating method
 *                   food_type:
 *                     type: string
 *                     description: Type of food
 *                   food_intake:
 *                     type: string
 *                     description: Food intake
 *                   sleep:
 *                     type: string
 *                     description: Sleep details
 *                   excretion:
 *                     type: string
 *                     description: Excretion details
 *                   extra_symptoms:
 *                     type: string
 *                     description: Extra symptoms (optional)
 *                   extra_food:
 *                     type: string
 *                     description: Extra food (optional)
 *                   notes:
 *                     type: string
 *                     description: Additional notes (optional)
 *       400:
 *         description: Missing required parameter HN
 *       500:
 *         description: Internal server error
 */
router.get("/patient/:HN/record", GetRecord);

module.exports = router;
