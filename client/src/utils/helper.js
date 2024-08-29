export const getCurrentShift = () => {
	const currentHour = new Date().getHours();

	if (currentHour >= 8 && currentHour < 16) {
		return "morning-shift";
	} else if (currentHour >= 16 && currentHour < 24) {
		return "afternoon-shift";
	} else {
		return "night-shift";
	}
};

// Utility function to calculate age
export const calculateAge = (dob) => {
	const birthDate = new Date(dob);
	const today = new Date();
	let age = today.getFullYear() - birthDate.getFullYear();
	const monthDiff = today.getMonth() - birthDate.getMonth();
	if (
		monthDiff < 0 ||
		(monthDiff === 0 && today.getDate() < birthDate.getDate())
	) {
		age--;
	}
	return age;
};

export const formatDateToThai = (dateString) => {
	// Given date
	const date = new Date(dateString);

	// Convert to Thai time (UTC+7)
	date.setHours(date.getHours() - 7);

	// Options for formatting the date in Thai
	const options = {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		timeZone: "Asia/Bangkok",
	};

	// Convert year to Buddhist year and format the date
	const thaiDate = date
		.toLocaleDateString("th-TH", options)
		.replace(date.getFullYear(), date.getFullYear() + 543);

	return thaiDate;
};
