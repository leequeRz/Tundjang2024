const { db } = require("../config/firebaseConfig");
const {
	checkField,
	dateToFirestoreTimestamp,
	firestoreTimestampToDateInUTCPlus7,
} = require("../utils");

const AddPatient = async (req, res) => {
	try {
		const requiredFields = ["HN", "prefix", "name", "surname", "gender", "DOB"];
		checkField(requiredFields, req, res);

		req.body.DOB = dateToFirestoreTimestamp(req.body.DOB);
		await db.collection("patients").doc(req.body.HN).create(req.body);

		res.status(200).send("success");
	} catch (error) {
		res.status(500).send(error.message);
	}
};

const EditPatient = async (req, res) => {
	try {
		const { HN } = req.params;
		const requiredFields = ["prefix", "name", "surname", "gender", "DOB"];
		checkField(requiredFields, req, res);

		req.body.DOB = dateToFirestoreTimestamp(req.body.DOB);
		await db.collection("patients").doc(HN).update(req.body);

		res.status(200).send("success");
	} catch (error) {
		res.status(500).send(error.message);
	}
};

const FindPatient = async (req, res) => {
	try {
		const { HN } = req.params;
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

		res.status(200).json(patients);
	} catch (error) {
		res.status(500).send(error.message);
	}
};

const DelPatient = async (req, res) => {
	try {
		const { HN } = req.params;
		if (!HN) {
			return res
				.status(400)
				.json({ message: "Missing required parameter: HN" });
		}

		await db.collection("patients").doc(HN).delete();
		res.status(200).send("Patient deleted successfully");
	} catch (error) {
		res.status(500).send(error.message);
	}
};

module.exports = {
	AddPatient,
	EditPatient,
	FindPatient,
	DelPatient,
};
