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
