const { db } = require("../config/firebaseConfig");
const { checkField, firestoreTimestampToDateInUTCPlus7 } = require("../utils");

// AddRecord for adding a new record
/**
 * @swagger
 * tags:
 *   name: Records
 *   description: Operations related to patient records
 */

/**
 * @swagger
 * /patient/{HN}/record:
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

/**
 * @swagger
 * /patient/{HN}/record:
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
 *         description: Missing required parameter: HN
 *       500:
 *         description: Internal server error
 */

const AddRecord = async (req, res) => {
	try {
		const requiredFields = [
			"BT",
			"BP",
			"HR",
			"RR",
			"O2sat",
			"conscious",
			"breath_pattern",
			"eat_method",
			"food_type",
			"food_intake",
			"sleep",
			"excretion",
		];
		checkField(requiredFields, req, res);

		const { HN } = req.params;
		if (!HN) {
			return res.status(400).send("Missing required parameter: HN");
		}

		const current_time = admin.firestore.Timestamp.now();
		const recordData = {
			timestamp: current_time,
			BT: req.body.BT,
			BP: req.body.BP,
			HR: req.body.HR,
			RR: req.body.RR,
			O2sat: req.body.O2sat,
			conscious: req.body.conscious,
			breath_pattern: req.body.breath_pattern,
			extra_symptoms: req.body.extra_symptoms || null,
			eat_method: req.body.eat_method,
			food_type: req.body.food_type,
			extra_food: req.body.extra_food || null,
			food_intake: req.body.food_intake,
			sleep: req.body.sleep,
			excretion: req.body.excretion,
			notes: req.body.notes || null,
		};

		const docId = `rec_${firestoreTimestampToDateInUTCPlus7(
			current_time,
			"noplus"
		)}`;
		await db
			.collection("patients")
			.doc(HN)
			.collection("records")
			.doc(docId)
			.set(recordData);

		res.status(200).send(docId);
	} catch (error) {
		res.status(500).send(error.message);
	}
};

// EditRecord for updating a specific record
/**
 * @swagger
 * /patient/{HN}/record/{docId}:
 *   post:
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
const EditRecord = async (req, res) => {
	try {
		const { HN, docId } = req.params;
		if (!HN || !docId) {
			return res.status(400).send("Missing required parameters: HN or docId");
		}

		const updateData = req.body;
		await db
			.collection("patients")
			.doc(HN)
			.collection("records")
			.doc(docId)
			.update(updateData);

		res.status(200).send("Edit success");
	} catch (error) {
		res.status(500).send(error.message);
	}
};

// DelRecord for deleting a specific record

const DelRecord = async (req, res) => {
	try {
		const { HN, docId } = req.params;
		if (!HN || !docId) {
			return res.status(400).send("Missing required parameters: HN or docId");
		}

		await db
			.collection("patients")
			.doc(HN)
			.collection("records")
			.doc(docId)
			.delete();

		res.status(200).send("Delete success");
	} catch (error) {
		res.status(500).send(error.message);
	}
};

// GetRecord for retrieving records for a specific patient
const GetRecord = async (req, res) => {
	try {
		const { HN } = req.params;

		if (!HN) {
			return res.status(400).send("Missing required parameter: HN");
		}

		const snapshot = await db
			.collection("patients")
			.doc(HN)
			.collection("records")
			.get();
		const records = [];
		snapshot.forEach((doc) => {
			const data = doc.data();
			if (data.timestamp) {
				data.timestamp = firestoreTimestampToDateInUTCPlus7(
					data.timestamp,
					"date"
				);
			}
			records.push({ id: doc.id, ...data });
		});

		res.status(200).json(records);
	} catch (error) {
		res.status(500).send(error.message);
	}
};

module.exports = {
	AddRecord,
	EditRecord,
	DelRecord,
	GetRecord,
};
