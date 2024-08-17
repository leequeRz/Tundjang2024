const { db } = require("../config/firebaseConfig");
const {
	checkField,
	dateToFirestoreTimestamp,
	firestoreTimestampToDateInUTCPlus7,
} = require("../utils");
const logger = require("../config/logger");
const {
	logRequest,
	timeExecution,
} = require("../middleware/performanceMiddleware");

const AddPatient = logRequest(
	timeExecution(async (req, res) => {
		try {
			const requiredFields = [
				"HN",
				"prefix",
				"name",
				"surname",
				"gender",
				"DOB",
			];
			if (!checkField(requiredFields, req, res)) {
				return;
			}

			req.body.DOB = dateToFirestoreTimestamp(req.body.DOB);
			await db.collection("patients").doc(req.body.HN).create(req.body);

			logger.info(`Patient added: ${req.body.HN}`); // Log the addition of a patient
			res.status(200).send({ message: "success" });
		} catch (error) {
			logger.error(`Error adding patient: ${error.message}`); // Log the error
			res.status(500).send(error.message);
		}
	})
);

const EditPatient = logRequest(
	timeExecution(async (req, res) => {
		try {
			const { HN } = req.params;
			const requiredFields = ["prefix", "name", "surname", "gender", "DOB"];
			if (!checkField(requiredFields, req, res)) {
				return;
			}

			req.body.DOB = dateToFirestoreTimestamp(req.body.DOB);
			await db.collection("patients").doc(HN).update(req.body);

			logger.info(`Patient updated: ${HN}`); // Log the update of a patient
			res.status(200).send({ message: "success" });
		} catch (error) {
			logger.error(`Error updating patient ${HN}: ${error.message}`); // Log the error
			res.status(500).send(error.message);
		}
	})
);

const FindPatient = logRequest(
	timeExecution(async (req, res) => {
		try {
			const HN = req.query.HN;
			let snapshot;

			if (!HN) {
				snapshot = await db.collection("patients").limit(15).get();
			} else {
				snapshot = await db.collection("patients").where("HN", "==", HN).get();
			}

			const patients = [];
			snapshot.forEach((doc) => {
				const data = doc.data();
				if (data.DOB) {
					data.DOB = firestoreTimestampToDateInUTCPlus7(data.DOB, "DOB");
				}
				patients.push({ id: doc.id, ...data });
			});

			logger.info(`Patient(s) found: ${HN ? HN : "all patients"}`); // Log the retrieval of patients
			res.status(200).json(patients);
		} catch (error) {
			logger.error(`Error finding patient(s): ${error.message}`); // Log the error
			res.status(500).send(error.message);
		}
	})
);

const DelPatient = logRequest(
	timeExecution(async (req, res) => {
		try {
			const { HN } = req.params;
			if (!HN) {
				return res
					.status(400)
					.json({ message: "Missing required parameter: HN" });
			}

			await db.collection("patients").doc(HN).delete();
			logger.info(`Patient deleted: ${HN}`); // Log the deletion of a patient
			res.status(200).send({ message: "Patient deleted successfully" });
		} catch (error) {
			logger.error(`Error deleting patient ${HN}: ${error.message}`); // Log the error
			res.status(500).send(error.message);
		}
	})
);

module.exports = {
	AddPatient,
	EditPatient,
	FindPatient,
	DelPatient,
};
