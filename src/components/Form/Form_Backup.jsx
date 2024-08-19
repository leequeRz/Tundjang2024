import React, { useState, useEffect, useMemo } from "react";
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
import { getCurrentShift, calculateAge } from "../../utils/helper";
import SearchFilterBar from "../SearchFilterBar";
import { useSearch } from "../../hooks/useSearch";
import { usePatients } from "../../context/patientContext";
import { usePatientRecords } from "../../context/patientRecordContext";

const Form = () => {
	const currentDate = new Date().toLocaleDateString();
	const { mutate } = useAddRecord();
	const [formHeader, setFormHeader] = useState({
		HN: "",
		name_surname: "",
		sex: "",
		age: "",
	});
	const [form, setForm] = useState({
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
		sleep: "",
		excretion: "",
		extra_symptoms: "",
		extra_food: "ตามปกติ",
		notes: "",
		shift: "",
	});

	const { patients } = usePatients();
	const { currentEditRecord, setCurrentEditRecord, useFetchRecords } =
		usePatientRecords();

	const { data: records = [] } = useFetchRecords(currentEditRecord.HN);

	const generateLabel = (item) => `${item.name} ${item.surname} (${item.HN})`;

	const patientOptions = useMemo(
		() =>
			patients.map((patient) => ({
				id: patient.id,
				label: generateLabel(patient),
			})),
		[patients]
	);

	const recordOptions = useMemo(
		() => [
			{ id: "create-new", label: "Create New Record" },
			...records.map((record) => ({
				id: record.id,
				label: record.id,
			})),
		],
		[records]
	);

	const {
		searchTerm: patientSearchTerm,
		setSearchTerm: setPatientSearchTerm,
		filteredItems: filteredPatients,
	} = useSearch(patientOptions, ["label"]);
	const {
		searchTerm: recordSearchTerm,
		setSearchTerm: setRecordSearchTerm,
		filteredItems: filteredRecords,
	} = useSearch(recordOptions, ["label"]);

	const handleSelectHNFilter = (value) => {
		setCurrentEditRecord({ HN: value, docId: null });

		const selectedPatient = patients.find((patient) => patient.id === value);
		if (selectedPatient) {
			setFormHeader({
				HN: selectedPatient.HN,
				name_surname: `${selectedPatient.name} ${selectedPatient.surname}`,
				sex: selectedPatient.gender,
				age: calculateAge(selectedPatient.DOB),
			});
			setForm({
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
				sleep: "",
				excretion: "",
				extra_symptoms: "",
				extra_food: "ตามปกติ",
				notes: "",
				shift: "",
			});
		}
	};

	const handleSelectRecordFilter = (value) => {
		setCurrentEditRecord((prev) => ({ ...prev, docId: value }));

		const selectedRecord = records.find((record) => record.id === value);
		if (selectedRecord) {
			setForm((prev) => ({
				...prev,
				BT: selectedRecord.BT || "ไม่มีไข้",
				BP: selectedRecord.BP || "ปกติ",
				HR: selectedRecord.HR || "ปกติ",
				RR: selectedRecord.RR || "ปกติ",
				O2sat: selectedRecord.O2sat || "ปกติ",
				conscious: selectedRecord.conscious || "ตื่น รู้สึกตัวดี",
				breath_pattern: selectedRecord.breath_pattern || "หายใจปกติ",
				eat_method: selectedRecord.eat_method || "รับประทานเองได้",
				food_type: selectedRecord.food_type || "นมแม่",
				food_intake: selectedRecord.food_intake || [""],
				sleep: selectedRecord.sleep || "",
				excretion: selectedRecord.excretion || "",
				extra_symptoms: selectedRecord.extra_symptoms || "",
				extra_food: selectedRecord.extra_food || "ตามปกติ",
				notes: selectedRecord.notes || "",
				shift: selectedRecord.shift || "",
			}));
		} else {
			setForm({
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
				sleep: "",
				excretion: "",
				extra_symptoms: "",
				extra_food: "ตามปกติ",
				notes: "",
				shift: "",
			});
		}
	};

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
				<SearchFilterBar
					searchTerm={patientSearchTerm}
					setSearchTerm={setPatientSearchTerm}
					filterItems={filteredPatients}
					onFilterSelected={handleSelectHNFilter}
				/>

				{/* Static Inputs */}
				<Grid container spacing={2} margin="normal">
					<Grid item xs={12} sm={6}>
						<TextField
							label="HN"
							value={formHeader.HN}
							InputProps={{ readOnly: true }}
							fullWidth
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							label="ชื่อ-สกุล"
							value={formHeader.name_surname}
							InputProps={{ readOnly: true }}
							fullWidth
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							label="เพศ"
							value={formHeader.sex}
							InputProps={{ readOnly: true }}
							fullWidth
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							label="อายุ"
							value={formHeader.age}
							InputProps={{ readOnly: true }}
							fullWidth
						/>
					</Grid>
				</Grid>
				<SearchFilterBar
					searchTerm={recordSearchTerm}
					setSearchTerm={setRecordSearchTerm}
					filterItems={filteredRecords}
					onFilterSelected={handleSelectRecordFilter}
				/>

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
