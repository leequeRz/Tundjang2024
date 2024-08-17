import React, { useState, useEffect } from "react";
import {
	Container,
	Divider,
	Typography,
	Radio,
	RadioGroup,
	FormControlLabel,
	FormControl,
	FormLabel,
	TextField,
	Button,
	Box,
	Grid,
} from "@mui/material";
import useAddRecord from "../../hooks/useAddRecord";
import { getCurrentShift } from "../../utils/helper";

const Form = () => {
	const currentDate = new Date().toLocaleDateString();
	const { mutate } = useAddRecord();
	const [form, setForm] = useState({
		HN: "Test Hn", // Hospital Number
		BT: "ไม่มีไข้",
		BP: "ปกติ",
		HR: "ปกติ",
		RR: "ปกติ",
		O2sat: "ปกติ",
		conscious: "ตื่น รู้สึกตัวดี",
		breath_pattern: "หายใจปกติ",
		eat_method: "รับประทานเองได้",
		food_type: "นมแม่",
		food_intake: [""],
		sleep: "", // Sleep pattern
		excretion: "", // Excretion
		extra_symptoms: "", // Additional symptoms
		extra_food: "ตามปกติ", // Additional food info
		notes: "", // Additional notes
		shift: "", // Define shift state
	});

	const handleFormChange = (e) => {
		setForm((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	useEffect(() => {
		setForm((prev) => ({
			...prev,
			shift: getCurrentShift(),
		}));
	}, []);

	const handleSubmit = (event) => {
		event.preventDefault();
		mutate(form);
	};

	return (
		<Container maxWidth="md">
			<Typography variant="h4" gutterBottom>
				บันทึกอาการรายวัน ประจำวันที่ {currentDate}
			</Typography>

			<form onSubmit={handleSubmit}>
				{/* Shift Selection */}
				<FormControl component="fieldset" margin="normal">
					<FormLabel component="legend" required>
						เวร
					</FormLabel>
					<RadioGroup
						row
						aria-label="shift"
						name="shift"
						value={form.shift}
						onChange={handleFormChange}
					>
						<FormControlLabel
							value="morning-shift"
							control={<Radio />}
							label="เวรเช้า (08:00 - 16:00)"
						/>
						<FormControlLabel
							value="afternoon-shift"
							control={<Radio />}
							label="เวรบ่าย (16:00 - 23:59)"
						/>
						<FormControlLabel
							value="night-shift"
							control={<Radio />}
							label="เวรดึก (00:00 - 08:00)"
						/>
					</RadioGroup>
				</FormControl>

				{/* Static Inputs */}
				<Grid container spacing={2} margin="normal">
					<Grid item xs={12} sm={6}>
						<TextField
							label="HN"
							value={form.HN}
							InputProps={{ readOnly: true }}
							fullWidth
							disabled
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							label="ชื่อ-สกุล"
							value="Auto-filled Name"
							InputProps={{ readOnly: true }}
							fullWidth
							disabled
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							label="เพศ"
							value="Auto-filled Gender"
							InputProps={{ readOnly: true }}
							fullWidth
							disabled
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							label="อายุ"
							value="Auto-filled Age"
							InputProps={{ readOnly: true }}
							fullWidth
							disabled
						/>
					</Grid>
				</Grid>

				<Divider sx={{ marginY: "3rem" }} />

				{/* Vital Signs Section */}
				<Typography variant="h5" gutterBottom>
					ส่วนที่ 1 สัญญาณชีพ
				</Typography>
				<Grid container spacing={2} marginBottom={2}>
					{[
						{
							label: "อุณหภูมิ (BT)",
							name: "BT",
							value: form.BT,
							options: ["ไม่มีไข้", "ไข้ต่ำ", "ไข้สูง"],
						},
						{
							label: "ความดันโลหิต (BP)",
							name: "BP",
							value: form.BP,
							options: ["ปกติ", "ต่ำ", "สูง"],
						},
						{
							label: "อัตราการเต้นของหัวใจ (HR)",
							name: "HR",
							value: form.HR,
							options: ["ปกติ", "ช้า", "เร็ว"],
						},
						{
							label: "อัตราการหายใจ (RR)",
							name: "RR",
							value: form.RR,
							options: ["ปกติ", "ช้า", "เร็ว"],
						},
						{
							label: "ค่าออกซิเจนในเลือด (O2sat)",
							name: "O2sat",
							value: form.O2sat,
							options: ["ปกติ", "ต่ำ"],
						},
					].map(({ label, name, value, options }) => (
						<Grid item xs={12} sm={6} key={name}>
							<FormControl component="fieldset">
								<FormLabel component="legend" required>
									{label}
								</FormLabel>
								<RadioGroup
									row
									aria-label={name}
									name={name}
									value={form[name]}
									onChange={handleFormChange}
								>
									{options.map((option) => (
										<FormControlLabel
											key={option}
											value={option}
											control={<Radio />}
											label={option}
										/>
									))}
								</RadioGroup>
							</FormControl>
						</Grid>
					))}
				</Grid>

				<Divider sx={{ marginY: "3rem" }} />

				{/* Additional Symptoms Section */}
				<Typography variant="h5" gutterBottom>
					ส่วนที่ 2 อาการเบื้องต้น
				</Typography>
				<Grid container spacing={2} marginBottom={2}>
					<Grid item xs={12} sm={6}>
						<FormControl component="fieldset">
							<FormLabel component="legend" required>
								ระดับความรู้สึกตัว
							</FormLabel>
							<RadioGroup
								row
								aria-label="conscious"
								name="conscious"
								value={form.conscious}
								onChange={handleFormChange}
							>
								{[
									"ตื่น รู้สึกตัวดี",
									"หลับ",
									"ซึม",
									"สับสน",
									"ไม่รู้สึกตัว",
								].map((option) => (
									<FormControlLabel
										key={option}
										value={option}
										control={<Radio />}
										label={option}
									/>
								))}
							</RadioGroup>
						</FormControl>
					</Grid>

					<Grid item xs={12} sm={6}>
						<FormControl component="fieldset">
							<FormLabel component="legend" required>
								ลักษณะการหายใจ
							</FormLabel>
							<RadioGroup
								row
								aria-label="breath_pattern"
								name="breath_pattern"
								value={form.breath_pattern}
								onChange={handleFormChange}
							>
								{["หายใจปกติ", "หายใจช้า", "หายใจเร็ว หายใจหอบเหนื่อย"].map(
									(option) => (
										<FormControlLabel
											key={option}
											value={option}
											control={<Radio />}
											label={option}
										/>
									)
								)}
							</RadioGroup>
						</FormControl>
					</Grid>

					<Grid item xs={12}>
						<TextField
							name="extra_symptoms"
							label="อาการเพิ่มเติม"
							value={form.extra_symptoms}
							placeholder="พิมพ์อาการเพิ่มเติมที่นี่"
							fullWidth
							onChange={handleFormChange}
						/>
					</Grid>
				</Grid>

				{/* Diet and Sleep Section */}
				<Typography variant="h6" gutterBottom>
					การรับประทานอาหาร
				</Typography>
				<Grid container spacing={2} marginBottom={2}>
					<Grid item xs={12} sm={6}>
						<FormControl component="fieldset">
							<FormLabel component="legend" required>
								รูปแบบการรับประทานอาหาร
							</FormLabel>
							<RadioGroup
								row
								aria-label="eat_method"
								name="eat_method"
								value={form.eat_method}
								onChange={handleFormChange}
							>
								{["รับประทานเองได้", "ใส่สายยางให้อาหาร"].map((option) => (
									<FormControlLabel
										key={option}
										value={option}
										control={<Radio />}
										label={option}
									/>
								))}
							</RadioGroup>
						</FormControl>
					</Grid>

					<Grid item xs={12} sm={6}>
						<FormControl component="fieldset">
							<FormLabel component="legend" required>
								อาหาร
							</FormLabel>
							<RadioGroup
								row
								aria-label="food_type"
								name="food_type"
								value={form.food_type}
								onChange={handleFormChange}
							>
								{["นมแม่", "นมผสม", "อาหารแข็ง", "อาหารอื่นๆ"].map((option) => (
									<FormControlLabel
										key={option}
										value={option}
										control={<Radio />}
										label={option}
									/>
								))}
							</RadioGroup>
						</FormControl>
					</Grid>

					<Grid item xs={12} sm={6}>
						<FormControl component="fieldset">
							<FormLabel component="legend" required>
								พฤติกรรมการรับประทานอาหาร
							</FormLabel>
							<RadioGroup
								row
								aria-label="extra_food"
								name="extra_food"
								value={form.extra_food}
								onChange={handleFormChange}
							>
								{["ตามปกติ", "รับประทานน้อย", "ไม่รับประทาน"].map((option) => (
									<FormControlLabel
										key={option}
										value={option}
										control={<Radio />}
										label={option}
									/>
								))}
							</RadioGroup>
						</FormControl>
					</Grid>

					<Grid item xs={12}>
						<TextField
							label="การนอนหลับ"
							name="sleep"
							value={form.sleep}
							placeholder="พิมพ์การนอนหลับที่นี่"
							fullWidth
							onChange={handleFormChange}
						/>
					</Grid>
				</Grid>

				{/* Additional Notes Section */}
				<Typography variant="h6" gutterBottom>
					หมายเหตุเพิ่มเติม
				</Typography>
				<TextField
					placeholder="พิมพ์หมายเหตุเพิ่มเติมที่นี่"
					name="notes"
					value={form.notes}
					multiline
					rows={4}
					fullWidth
					margin="normal"
					onChange={handleFormChange}
				/>

				<Box marginTop={2}>
					<Button type="submit" variant="contained" color="primary">
						บันทึกข้อมูล
					</Button>
				</Box>
			</form>
		</Container>
	);
};

export default Form;
