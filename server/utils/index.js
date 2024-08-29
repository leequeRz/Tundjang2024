const crypto = require("crypto");
const { admin } = require("../config/firebaseConfig");
const logger = require("../config/logger");
const Timestamp = admin.firestore.Timestamp;

const firestoreTimestampToDateInUTCPlus7 = (
	firestoreTimestamp,
	returnFormat = "DOB"
) => {
	// Convert Firestore Timestamp to JavaScript Date (in UTC)
	// const utcDate = new Date(firestoreTimestamp);
	const utcDate = firestoreTimestamp.toDate();

	if (returnFormat === "noplus") {
		// Return as UTC date in 'YYYY-MM-DD' format without adjustment
		return new Date(utcDate.getTime());
	} else if (returnFormat === "DOB") {
		// Convert UTC Date to UTC+7 by adding 7 hours (7 * 60 * 60 * 1000 milliseconds)
		const offsetMilliseconds = 7 * 60 * 60 * 1000; // 7 hours in milliseconds
		const utcPlus7Date = new Date(utcDate.getTime() + offsetMilliseconds);

		// Return as 'YYYY-MM-DD'
		const year = utcPlus7Date.getFullYear();
		const month = String(utcPlus7Date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
		const day = String(utcPlus7Date.getDate()).padStart(2, "0");
		return `${year}-${month}-${day}`;
	} else {
		// Return as full Date object (with time) in UTC+7 if not 'noplus' or 'DOB'
		const offsetMilliseconds = 7 * 60 * 60 * 1000; // 7 hours in milliseconds
		const utcPlus7Date = new Date(utcDate.getTime() + offsetMilliseconds);
		return utcPlus7Date;
	}
};

const dateToFirestoreTimestamp = (dateString) => {
	// Parse the YYYY-MM-DD string to a JavaScript Date object
	const [year, month, day] = dateString.split("-").map(Number);
	const date = new Date(year, month - 1, day); // Months are 0-based in Date

	// Convert from UTC+7 to UTC by subtracting 7 hours
	const utcDate = new Date(date.getTime() - 7 * 60 * 60 * 1000);

	// Create Firestore Timestamp from JavaScript Date
	return Timestamp.fromDate(utcDate);
};

const dateISOToFirestoreTimestamp = (dateISOString) => {
	const date = new Date(dateISOString);
	return Timestamp.fromDate(date);
};

function checkField(requiredFields, req, res) {
	for (const field of requiredFields) {
		if (!req.body[field]) {
			logger.warn(`Missing required field: ${field}`);
			res.status(400).json({
				message: `Missing required field: ${field}`,
			});
			return false;
		}
	}
	return true;
}

function checkParam(requiredParams, req, res) {
	for (const param of requiredParams) {
		if (!req.params[param] && !req.query[param]) {
			logger.warn(`Missing required parameter: ${param}`);
			res.status(400).json({
				message: `Missing required parameter: ${param}`,
			});
			return false;
		}
	}
	return true;
}

const hashData = (data) => {
	return crypto.createHash("sha512").update(data).digest("hex");
};

module.exports = {
	firestoreTimestampToDateInUTCPlus7,
	dateToFirestoreTimestamp,
	checkField,
	checkParam,
	hashData,
};
