import React, { useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Button,
} from "@mui/material";
import PatientRecordPopup from "./PatientRecordPopup"; // Adjust the path as needed

const PatientRecordRow = ({ patient, record }) => {
	const [isPopupOpen, setPopupOpen] = useState(false);
	const [patientRecord, setPatientRecord] = useState({
		id: "",
		RR: "",
		extra_food: "",
		notes: "",
		HR: "",
		breath_pattern: "",
		food_type: "",
		extra_symptoms: "",
		eat_method: "",
		BP: "",
		sleep: "",
		BT: "",
		O2sat: "",
		excretion: "",
		food_intake: [],
		conscious: "",
		timestamp: "",
	});

	const openPopup = () => setPopupOpen(true);
	const closePopup = () => setPopupOpen(false);

	return (
		<>
			<TableRow>
				<TableCell colSpan={8}>
					<div className="sub-row">
						<Table size="small">
							<TableHead>
								<TableRow>
									<TableCell>Timestamp</TableCell>
									<TableCell>Detail</TableCell>
									<TableCell>Actions</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{record.map((entry) => (
									<TableRow
										key={entry.timestamp}
										onClick={() => {
											setPatientRecord(entry);
											openPopup();
										}}
									>
										<TableCell>{entry.timestamp}</TableCell>
										<TableCell>{entry.detail}</TableCell>
										<TableCell>
											<Button
												variant="contained"
												color="primary"
												onClick={() => {
													setPatientRecord(entry);
													openPopup();
												}}
											>
												View Details
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</TableCell>
			</TableRow>

			<PatientRecordPopup
				open={isPopupOpen}
				onClose={closePopup}
				patient={patient}
				record={patientRecord}
			/>
		</>
	);
};

export default PatientRecordRow;
