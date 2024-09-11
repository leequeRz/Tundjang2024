import React from "react";
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Container,
	Divider,
	Typography,
	Grid,
	Button,
} from "@mui/material";
import { calculateAge } from "../../utils/helper";

const PatientRecordPopup = ({ open, onClose, patient, record }) => {
	console.log(record)
	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="sm"
			fullWidth
			sx={{ padding: "1rem" }}
		>
			<DialogTitle>
				<Typography variant="h5" component={"div"}>
					รายละเอียดการบันทึกอาการ
				</Typography>
			</DialogTitle>
			<DialogContent>
				<Container>
					<Grid container spacing={1}>
						{/* Static Inputs */}
						<Grid item xs={12} sm={6}>
							<Typography variant="body2" gutterBottom>
								<strong>HN:</strong> {patient.HN}
							</Typography>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Typography variant="body2" gutterBottom>
								<strong>ชื่อ-สกุล:</strong> {patient.name} {patient.surname}
							</Typography>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Typography variant="body2" gutterBottom>
								<strong>เพศ:</strong> {patient.gender}
							</Typography>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Typography variant="body2" gutterBottom>
								<strong>อายุ:</strong> {calculateAge(patient.DOB)}
							</Typography>
						</Grid>
					</Grid>

					<Divider sx={{ marginY: "2rem" }} />

					{/* Vital Signs Section */}
					<Typography variant="h6" gutterBottom>
						ส่วนที่ 1 สัญญาณชีพ
					</Typography>
					<Grid container spacing={1}>
						<Grid item xs={12} sm={6}>
							<Typography variant="body2" gutterBottom>
								<strong>อุณหภูมิ (BT):</strong> {record.BT}
							</Typography>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Typography variant="body2" gutterBottom>
								<strong>ความดันโลหิต (BP):</strong> {record.BP}
							</Typography>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Typography variant="body2" gutterBottom>
								<strong>อัตราการเต้นของหัวใจ (HR):</strong> {record.HR}
							</Typography>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Typography variant="body2" gutterBottom>
								<strong>อัตราการหายใจ (RR):</strong> {record.RR}
							</Typography>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Typography variant="body2" gutterBottom>
								<strong>ค่าออกซิเจนในเลือด (O2sat):</strong> {record.O2sat}
							</Typography>
						</Grid>
					</Grid>

					<Divider sx={{ marginY: "2rem" }} />

					{/* Additional Symptoms Section */}
					<Typography variant="h6" gutterBottom>
						ส่วนที่ 2 อาการเบื้องต้น
					</Typography>
					<Grid container spacing={1}>
						<Grid item xs={12}>
							<Typography variant="body2" gutterBottom>
								<strong>ระดับความรู้สึกตัว:</strong> {record.conscious}
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<Typography variant="body2" gutterBottom>
								<strong>ลักษณะการหายใจ:</strong> {record.breath_pattern}
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<Typography variant="body2" gutterBottom>
								<strong>อาการเพิ่มเติม:</strong> {record.extra_symptoms}
							</Typography>
						</Grid>
					</Grid>

					<Divider sx={{ marginY: "2rem" }} />

					{/* Diet and Sleep Section */}
					<Typography variant="h6" gutterBottom>
						ส่วนที่ 3 การรับประทานอาหาร
					</Typography>
					<Grid container spacing={1}>
						<Grid item xs={12}>
							<Typography variant="body2" gutterBottom>
								<strong>รูปแบบการรับประทานอาหาร:</strong> {record.eat_method}
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<Typography variant="body2" gutterBottom>
								<strong>อาหารเพิ่มเติม:</strong> {record.extra_food}
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<Typography variant="body2" gutterBottom>
								<strong>การนอนหลับ:</strong> {record.sleep}
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<Typography variant="body2" gutterBottom>
								<strong>การขับถ่าย:</strong> {record.excretion}
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<Typography variant="body2" gutterBottom>
								<strong>จำนวนปัสสาวะ:</strong> {record.urine_num}
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<Typography variant="body2" gutterBottom>
								<strong>จำนวนอุจจาระ:</strong> {record.stool_num}
							</Typography>
						</Grid>
					</Grid>
				</Container>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color="primary">
					<Typography variant="button" display="block" gutterBottom>
						ปิด
					</Typography>
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default PatientRecordPopup;
