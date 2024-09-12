import React, { useState, useEffect, useMemo, useCallback } from "react";
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
	Snackbar,
	Alert,
	Autocomplete,
	Checkbox,
} from "@mui/material";
import { getCurrentShift, calculateAge } from "../../utils/helper";
import SearchFilterBar from "../SearchFilterBar";
import { useSearch } from "../../hooks/useSearch";
import { usePatients } from "../../context/patientContext";
import { usePatientRecords } from "../../context/patientRecordContext";

const VITAL_SIGNS = [
	{
		label: "อุณหภูมิ (BT)",
		name: "BT",
		options: ["ไม่มีไข้", "ไข้ต่ำ", "ไข้สูง"],
	},
	{ label: "ความดันโลหิต (BP)", name: "BP", options: ["ปกติ", "ต่ำ", "สูง"] },
	{
		label: "อัตราการเต้นของหัวใจ (HR)",
		name: "HR",
		options: ["ปกติ", "ช้า", "เร็ว"],
	},
	{ label: "อัตราการหายใจ (RR)", name: "RR", options: ["ปกติ", "ช้า", "เร็ว"] },
	{
		label: "ค่าออกซิเจนในเลือด (O2sat)",
		name: "O2sat",
		options: ["ปกติ", "ต่ำ"],
	},
];

const CONSCIOUS_OPTIONS = [
	"ตื่น รู้สึกตัวดี",
	"หลับ",
	"ซึม",
	"สับสน",
	"ไม่รู้สึกตัว",
];
const BREATH_PATTERN_OPTIONS = [
	"หายใจปกติ",
	"หายใจช้า",
	"หายใจเร็ว",
	"หายใจหอบเหนื่อย",
];

const PHLEGM_OPTIONS = ["ไม่มีเสมหะ", "มีเสมหะ"];
const EAT_METHOD_OPTIONS = ["รับประทานเองได้", "ใส่สายยางให้อาหาร"];
const SLEEP_OPTIONS = ["นอนหลับได้", "นอนไม่หลับ", "หลับๆ ตื่นๆ"];
const EXCRETION_OPTIONS = [" ถ่ายดี", " ท้องเสีย", " ท้องผูก"];
const FOOD_TYPE_OPTIONS = ["นมแม่", "นมผสม", "อาหารแข็ง", "อาหารอื่นๆ"];
const FOOD_INTAKE_OPTIONS = [" กินได้ดี"," กินได้น้อย"," กินไม่ได้"," สำลัก"," คลื่นไส้อาเจียน"," ท้องอืด"]
const EXTRA_FOOD_OPTIONS = ["ตามปกติ", "รับประทานน้อย", "ไม่รับประทาน"];

const initialFormState = {
	BT: "ไม่มีไข้",
	BP: "ปกติ",
	HR: "ปกติ",
	RR: "ปกติ",
	O2sat: "ปกติ",
	conscious: "ตื่น รู้สึกตัวดี",
	breath_pattern: "หายใจปกติ",
	eat_method: "รับประทานเองได้",
	phlegm: "ไม่มีเสมหะ",
	food_type: "นมแม่",
	food_intake: ["กินได้ดี"],
	// eat_value:["กินได้ดี"],
	sleep: "นอนหลับได้",
	excretion: ["ถ่ายดี"],
	urine_num:"",
	stool_num:"",
	extra_symptoms: "",
	extra_food: "ตามปกติ",
	notes: "",
	shift: getCurrentShift(),
};

const Form = () => {
	const currentDate = new Date().toLocaleDateString();
	const [formHeader, setFormHeader] = useState({
		HN: "",
		"name surname": "",
		sex: "",
		age: "",
	});
	const [form, setForm] = useState(initialFormState);
	const [alert, setAlert] = useState({
		open: false,
		severity: "success",
		message: "",
	});

	const { patients } = usePatients();
	const {
		currentEditRecord,
		setCurrentEditRecord,
		useFetchRecords,
		addRecord,
		updateRecord,
	} = usePatientRecords();

	// console.log(currentEditRecord);
	const { data: records = [] } = useFetchRecords(currentEditRecord.HN?.trim());

	const generateLabel = useCallback(
		(item) => `${item.name} ${item.surname} (${item.HN})`,
		[]
	);

	const patientOptions = useMemo(
		() =>
			patients.map((patient) => ({
				id: patient.id,
				label: generateLabel(patient),
			})),
		[patients, generateLabel]
	);

	const recordOptions = useMemo(
		() => [
			{ id: "create-new", label: "Create New Record" },
			...records.map((record) => ({ id: record.id, label: record.id })),
		],
		[records]
	);
	// const [excretion, setExcretion] = useState([]);
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

	const handleSelectHNFilter = useCallback(
		(value) => {
			setCurrentEditRecord({
				HN: value.id,
				docId: { id: "create-new", label: "Create New Record" },
			});
			const selectedPatient = patients.find(
				(patient) => patient.id === value.id
			);
			if (selectedPatient) {
				setFormHeader({
					HN: selectedPatient.HN.trim(),
					"name surname": `${selectedPatient.name} ${selectedPatient.surname}`,
					sex: selectedPatient.gender,
					age: calculateAge(selectedPatient.DOB),
				});
				setForm(initialFormState);
			}
		},
		[patients, setCurrentEditRecord]
	);

	const handleSelectRecordFilter = useCallback(
		(value) => {
			setCurrentEditRecord((prev) => ({ ...prev, docId: value }));
			const selectedRecord = records.find((record) => record.id === value);
			if (selectedRecord) {
				setForm((prev) => ({
					...prev,
					...selectedRecord,
					food_type: selectedRecord.food_type || [""],
				}));
			} else {
				setForm(initialFormState);
			}
		},
		[records, setCurrentEditRecord]
	);

	useEffect(() => {
		// console.log(currentEditRecord);
		handleSelectHNFilter({ id: currentEditRecord.HN });
		handleSelectRecordFilter(currentEditRecord.docId);
	}, []);

	useEffect(() => {
		console.log('Form state updated:', form);
	  }, [form]);

	const handleFormChange = useCallback((e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	}, []);

	const handleSubmit = useCallback(
		(event) => {
			event.preventDefault();

			const recordData = {
				HN: formHeader.HN,
				record: {
					...form,
					id: currentEditRecord.docId.id,
				},
			};

			const options = {
				onSuccess: () => {
					setAlert({
						open: true,
						message: "Record successfully saved!",
						severity: "success",
					});
				},
				onError: () => {
					setAlert({
						open: true,
						message: "An error occurred while saving the record.",
						severity: "error",
					});
				},
			};

			if (
				currentEditRecord.docId &&
				currentEditRecord.docId.id !== "create-new"
			) {
				updateRecord(recordData, options);
			} else {
				addRecord(recordData, options);
				setForm(initialFormState);
			}
		},
		[form, formHeader.HN, currentEditRecord.docId, addRecord, updateRecord]
	);

	const handleCloseAlert = () => {
		setAlert({ ...alert, open: false });
	};

	const renderRadioGroup = useCallback(
		({ label, name, value, options }) => (
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
		),
		[handleFormChange]
	);

	return (
		<Container maxWidth="md">
			<Typography variant="h4" gutterBottom sx={{ marginY: 4 }}>
				บันทึกอาการรายวัน ประจำวันที่ {currentDate}
			</Typography>

			<form onSubmit={handleSubmit}>
				<Grid container spacing={2} margin="normal">
					<Grid item xs={12} sm={12}>
						<SearchFilterBar
							searchTerm={patientSearchTerm}
							setSearchTerm={setPatientSearchTerm}
							selectedValue={currentEditRecord.HN}
							filterItems={filteredPatients}
							onFilterSelected={handleSelectHNFilter}
							label="Patient HN"
							placeholder="Search by HN name or surname"
							required={true}
						/>
					</Grid>
					{Object.entries(formHeader).map(([key, value]) => (
						<Grid item xs={12} sm={6} key={key}>
							<TextField
								label={key}
								value={value}
								InputProps={{ readOnly: true }}
								fullWidth
							/>
						</Grid>
					))}
					<Grid item xs={12} sm={12}>
						<SearchFilterBar
							searchTerm={recordSearchTerm}
							setSearchTerm={setRecordSearchTerm}
							selectedValue={currentEditRecord.docId}
							filterItems={filteredRecords}
							onFilterSelected={handleSelectRecordFilter}
							label="Patient Record"
							placeholder="Search by record id"
							required={true}
						/>
					</Grid>
				</Grid>

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
						{[
							{ value: "morning-shift", label: "เวรเช้า (08:00 - 16:00)" },
							{ value: "afternoon-shift", label: "เวรบ่าย (16:00 - 23:59)" },
							{ value: "night-shift", label: "เวรดึก (00:00 - 08:00)" },
						].map(({ value, label }) => (
							<FormControlLabel
								key={value}
								value={value}
								control={<Radio />}
								label={label}
							/>
						))}
					</RadioGroup>
				</FormControl>

				{formHeader.HN && (
					<>
						<Divider sx={{ marginY: "3rem" }} />
						<Box
							sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
						>
							<Typography variant="body1">HN: {formHeader.HN}</Typography>
							<Typography variant="body1">
								Name: {formHeader["name surname"]}
							</Typography>
							<Typography variant="body1">Sex: {formHeader.sex}</Typography>
							<Typography variant="body1">Age: {formHeader.age}</Typography>
							<Typography variant="body1">Shift: {form.shift}</Typography>
						</Box>

						<Typography variant="h5" gutterBottom>
							ส่วนที่ 1 สัญญาณชีพ
						</Typography>
						<Grid container spacing={2} marginBottom={2}>
							{VITAL_SIGNS.map((vitalSign) =>
								renderRadioGroup({ ...vitalSign, value: form[vitalSign.name] })
							)}
						</Grid>

						<Divider sx={{ marginY: "3rem" }} />

						<Typography variant="h5" gutterBottom>
							ส่วนที่ 2 อาการเบื้องต้น
						</Typography>
						<Grid container spacing={2} marginBottom={2}>
							{renderRadioGroup({
								label: "ระดับความรู้สึกตัว",
								name: "conscious",
								value: form.conscious,
								options: CONSCIOUS_OPTIONS,
							})}
							{renderRadioGroup({
								label: "ลักษณะการหายใจ",
								name: "breath_pattern",
								value: form.breath_pattern,
								options: BREATH_PATTERN_OPTIONS,
							})}
							{renderRadioGroup({
								label: "เสมหะ",
								name: "phlegm",
								value: form.phlegm,
								options: PHLEGM_OPTIONS,
							})}
							<Grid item xs={12}>
								<TextField
									name="extra_symptoms"
									label="อาการเพิ่มเติม"
									InputLabelProps={{ shrink: true }}
									value={form.extra_symptoms}
									placeholder="พิมพ์อาการเพิ่มเติมที่นี่"
									fullWidth
									onChange={handleFormChange}
								/>
							</Grid>
						</Grid>


						<Divider sx={{ marginY: "3rem" }} />
							
						<Typography variant="h6" gutterBottom>
						ส่วนที่ 3 อาหาร
						</Typography>
						<Grid container spacing={2} marginBottom={2}>
							{renderRadioGroup({
								label: "รูปแบบการรับประทานอาหาร",
								name: "eat_method",
								value: form.eat_method,
								options: EAT_METHOD_OPTIONS,
							})}
							{renderRadioGroup({
								label: "ประเภทของอาหารอาหาร",
								name: "food_type",
								value: form.food_type,
								options: FOOD_TYPE_OPTIONS,
							})}
						
							{renderRadioGroup({
								label: "พฤติกรรมการรับประทานอาหาร",
								name: "extra_food",
								value: form.extra_food,
								options: EXTRA_FOOD_OPTIONS,
							})}
							<Grid item xs={12} sm={6}>
								<FormControl component="fieldset">
									<FormLabel component="legend" required>
									การรับประทานอาหาร
									</FormLabel>
									<Autocomplete
										multiple
										options={FOOD_INTAKE_OPTIONS}
										value={form.food_intake}
										onChange={(_, value) =>
											setForm((prev) => ({ ...prev, food_intake: value }))
										}
										renderOption={(props, option, { selected }) => (
											<li {...props}>
												<Checkbox
													style={{ marginRight: 8 }}
													checked={selected}
												/>
												{option}
											</li>
										)}
										renderInput={(params) => <TextField {...params} />}
									/>
								</FormControl>
							</Grid>
							
							{renderRadioGroup({
								label: "การนอนหลับ",
								name: "sleep",
								value: form.sleep,
								options: SLEEP_OPTIONS,
							})}


							
							<Grid item xs={12} sm={6}>
							<FormControl component="fieldset">
								<FormLabel component="legend" required>
								การขับถ่าย
								</FormLabel>
								<Autocomplete
									multiple
									options={EXCRETION_OPTIONS }
									value={form.excretion}
									onChange={(_, value) =>
										setForm((prev) => ({ ...prev, excretion: value }))
									}
									renderOption={(props, option, { selected }) => (
										<li {...props}>
											<Checkbox
												style={{ marginRight: 8 }}
												checked={selected}
											/>												{option}
										</li>
									)}
									renderInput={(params) => <TextField {...params} />}
								/>
							</FormControl>
							</Grid>
									{/* Urine and Stool Count */}
							<Grid item xs={12} sm={6}></Grid>
							<Grid item xs={12} sm={6}>
								<Grid item xs={12} sm={6}>
									<TextField	
										label="จำนวนปัสสาวะ"
										name="urine_num"
										value={form.urine_num}
										onChange={handleFormChange}
									/>
								</Grid>
								<Grid item xs={12} sm={6}>
									<TextField
										label="จำนวนอุจจาระ"
										name="stool_num"
										value={form.stool_num}
										onChange={handleFormChange}
									/>
								</Grid>
							</Grid>

							
						</Grid>

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

						<Box marginTop={2} marginBottom={15}>
							<Button type="submit" variant="contained" color="primary">
								บันทึกข้อมูล
							</Button>
						</Box>
					</>
				)}
			</form>
			<Snackbar
				open={alert.open}
				autoHideDuration={6000}
				onClose={handleCloseAlert}
			>
				<Alert
					anchorOrigin={{ vertical: "top", horizontal: "center" }}
					onClose={handleCloseAlert}
					severity={alert.severity}
					sx={{ width: "100%" }}
				>
					{alert.message}
				</Alert>
			</Snackbar>
		</Container>
	);
};

export default Form;
