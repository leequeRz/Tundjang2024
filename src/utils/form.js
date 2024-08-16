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
