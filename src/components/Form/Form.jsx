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
import useAddRecord from "./useAddRecord";
import { getCurrentShift } from "../../utils/form";

const Form = () => {
	const currentDate = new Date().toLocaleDateString();
	const { mutate } = useAddRecord();

	// State for managing form values
	const [hn, setHn] = useState(""); // Hospital Number
	const [bt, setBt] = useState("ไม่มีไข้");
	const [bp, setBp] = useState("ปกติ");
	const [hr, setHr] = useState("ปกติ");
	const [rr, setRr] = useState("ปกติ");
	const [o2sat, setO2sat] = useState("ปกติ");
	const [conscious, setConscious] = useState("ตื่น รู้สึกตัวดี");
	const [breathing, setBreathing] = useState("หายใจปกติ");
	const [eating, setEating] = useState("รับประทานเองได้");
	const [food, setFood] = useState("นมแม่");
	const [eatingBehavior, setEatingBehavior] = useState("ตามปกติ");
	const [extraSymptoms, setExtraSymptoms] = useState(""); // Additional symptoms
	const [extraFood, setExtraFood] = useState(""); // Additional food info
	const [sleep, setSleep] = useState(""); // Sleep pattern
	const [excretion, setExcretion] = useState(""); // Excretion
	const [notes, setNotes] = useState(""); // Additional notes
	const [shift, setShift] = useState(""); // Define shift state

	useEffect(() => {
		setShift(getCurrentShift()); // Set default shift based on current time
	}, []);

	const handleSubmit = (event) => {
		event.preventDefault();

		const data = {
			HN: hn,
			BT: bt,
			BP: bp,
			HR: hr,
			RR: rr,
			O2sat: o2sat,
			conscious: conscious,
			breath_pattern: breathing,
			eat_method: eating,
			food_type: food,
			food_intake: [food],
			sleep: sleep,
			excretion: excretion,
			extra_symptoms: extraSymptoms,
			extra_food: extraFood,
			notes: notes,
		};

		mutate(data);
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
						value={shift}
						onChange={(e) => setShift(e.target.value)}
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
							value="Auto-filled HN"
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
							name: "bt",
							value: bt,
							options: ["ไม่มีไข้", "ไข้ต่ำ", "ไข้สูง"],
							setValue: setBt,
						},
						{
							label: "ความดันโลหิต (BP)",
							name: "bp",
							value: bp,
							options: ["ปกติ", "ต่ำ", "สูง"],
							setValue: setBp,
						},
						{
							label: "อัตราการเต้นของหัวใจ (HR)",
							name: "hr",
							value: hr,
							options: ["ปกติ", "ช้า", "เร็ว"],
							setValue: setHr,
						},
						{
							label: "อัตราการหายใจ (RR)",
							name: "rr",
							value: rr,
							options: ["ปกติ", "ช้า", "เร็ว"],
							setValue: setRr,
						},
						{
							label: "ค่าออกซิเจนในเลือด (O2sat)",
							name: "o2sat",
							value: o2sat,
							options: ["ปกติ", "ต่ำ"],
							setValue: setO2sat,
						},
					].map(({ label, name, value, options, setValue }) => (
						<Grid item xs={12} sm={6} key={name}>
							<FormControl component="fieldset">
								<FormLabel component="legend" required>
									{label}
								</FormLabel>
								<RadioGroup
									row
									aria-label={name}
									name={name}
									value={value}
									onChange={(e) => setValue(e.target.value)}
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
								value={conscious}
								onChange={(e) => setConscious(e.target.value)}
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
								aria-label="breathing"
								name="breathing"
								value={breathing}
								onChange={(e) => setBreathing(e.target.value)}
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
							label="อาการเพิ่มเติม"
							value={extraSymptoms}
							placeholder="พิมพ์อาการเพิ่มเติมที่นี่"
							fullWidth
							onChange={(e) => setExtraSymptoms(e.target.value)}
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
								aria-label="eating"
								name="eating"
								value={eating}
								onChange={(e) => setEating(e.target.value)}
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
								aria-label="food"
								name="food"
								value={food}
								onChange={(e) => setFood(e.target.value)}
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
								aria-label="eating-behavior"
								name="eating-behavior"
								value={eatingBehavior}
								onChange={(e) => setEatingBehavior(e.target.value)}
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
							value={sleep}
							placeholder="พิมพ์การนอนหลับที่นี่"
							fullWidth
							onChange={(e) => setSleep(e.target.value)}
						/>
					</Grid>
				</Grid>

				{/* Additional Notes Section */}
				<Typography variant="h6" gutterBottom>
					หมายเหตุเพิ่มเติม
				</Typography>
				<TextField
					placeholder="พิมพ์หมายเหตุเพิ่มเติมที่นี่"
					value={notes}
					multiline
					rows={4}
					fullWidth
					margin="normal"
					onChange={(e) => setNotes(e.target.value)}
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
