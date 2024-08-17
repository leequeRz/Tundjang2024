const { db } = require("../config/firebaseConfig");
const {
	checkField,
	firestoreTimestampToDateInUTCPlus7,
	dateToFirestoreTimestamp,
} = require("../utils");
const logger = require("../config/logger"); // Import the logger
const {
	logRequest,
	timeExecution,
} = require("../middleware/performanceMiddleware");

// AddRecord for adding a new record
const AddRecord = logRequest(
	timeExecution(async (req, res) => {
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
			if (!checkField(requiredFields, req, res)) {
				return;
			}

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

			logger.info(`Record added for patient ${HN} with ID ${docId}`); // Log success
			res.status(200).send(docId);
		} catch (error) {
			logger.error(`Error adding record for patient ${HN}: ${error.message}`); // Log error
			res.status(500).send(error.message);
		}
	})
);

// EditRecord for updating a specific record
const EditRecord = logRequest(
	timeExecution(async (req, res) => {
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

			logger.info(`Record updated for patient ${HN} with ID ${docId}`); // Log success
			res.status(200).send("Edit success");
		} catch (error) {
			logger.error(
				`Error updating record for patient ${HN} with ID ${docId}: ${error.message}`
			); // Log error
			res.status(500).send(error.message);
		}
	})
);

// DelRecord for deleting a specific record
const DelRecord = logRequest(
	timeExecution(async (req, res) => {
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

			logger.info(`Record deleted for patient ${HN} with ID ${docId}`); // Log success
			res.status(200).send("Delete success");
		} catch (error) {
			logger.error(
				`Error deleting record for patient ${HN} with ID ${docId}: ${error.message}`
			); // Log error
			res.status(500).send(error.message);
		}
	})
);

// GetRecord for retrieving records for a specific patient
const GetRecord = logRequest(
	timeExecution(async (req, res) => {
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

			logger.info(`Records retrieved for patient ${HN}`); // Log success
			res.status(200).json(records);
		} catch (error) {
			logger.error(
				`Error retrieving records for patient ${HN}: ${error.message}`
			); // Log error
			res.status(500).send(error.message);
		}
	})
);

module.exports = {
	AddRecord,
	EditRecord,
	DelRecord,
	GetRecord,
};
