import React from "react";
import { TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs"; // Ensure you have dayjs installed
import {
	formatDateToThaiDayJS,
	convertToThaiYear,
	convertToGregorianYear,
} from "../utils/helper";

const ThaiYearDatePicker = ({ label, value, onChange, ...props }) => {
	const defaultDate = dayjs();
	const maxDate = convertToThaiYear(defaultDate);
	const displayValue = value
		? convertToThaiYear(dayjs(value))
		: convertToThaiYear(defaultDate);

	const handleDateChange = (newValue) => {
		// Convert the selected date back to Gregorian year format
		onChange(newValue ? convertToGregorianYear(newValue) : defaultDate);
	};

	return (
		<DatePicker
			label={label}
			value={displayValue}
			maxDate={maxDate}
			onChange={handleDateChange}
			sx={{ mt: 1 }}
			renderInput={(params) => (
				<TextField {...params} helperText={formatDateToThaiDayJS(value)} />
			)}
			{...props}
		/>
	);
};

export default ThaiYearDatePicker;
