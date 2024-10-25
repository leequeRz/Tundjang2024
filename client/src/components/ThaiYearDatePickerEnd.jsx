import React from "react";
import { TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs"; // Ensure you have dayjs installed
import {
	formatDateToThaiDayJS,
	convertToThaiYear,
	convertToGregorianYear,
} from "../utils/helper";

const ThaiYearDatePickerEnd = ({ label, value, onChange, ...props }) => {
	const defaultDate = dayjs(); // วันที่วันนี้
	const maxDate = dayjs().add(30, 'year'); // วันที่สูงสุด = วันนี้ + 30 ปี
	const displayValue = value
		? convertToThaiYear(dayjs(value))
		: convertToThaiYear(defaultDate);

	const handleDateChange = (newValue) => {
		// แปลงวันที่จากปีไทยกลับเป็นปีเกรกอเรียน
		onChange(newValue ? convertToGregorianYear(newValue) : defaultDate);
	};

	return (
		<DatePicker
			label={label}
			value={displayValue}
			maxDate={convertToThaiYear(maxDate)} // กำหนด maxDate เป็นปีไทย
			onChange={handleDateChange}
			sx={{ mt: 1 }}
			renderInput={(params) => (
				<TextField {...params} helperText={formatDateToThaiDayJS(value)} />
			)}
			{...props}
		/>
	);
};

export default ThaiYearDatePickerEnd;
