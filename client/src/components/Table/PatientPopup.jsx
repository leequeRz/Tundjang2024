import React from "react";
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Button,
	Grid,
} from "@mui/material";
import { usePatientForm } from "../../hooks/usePatientForm";
import { FormField, SelectField } from "./FormComponents";

const PatientPopup = ({ open, onClose, patientData }) => {
	const { formData, handleChange, handleSubmit, isSubmitting } = usePatientForm(
		patientData,
		onClose
	);

	const formFields = [
		{ name: "HN", label: "Hospital Name", disabled: !!patientData, sm: 12 },
		{
			name: "prefix",
			label: "Prefix",
			type: "select",
			options: ["Mr.", "Mrs.", "Ms."],
			sm: 2,
		},
		{ name: "name", label: "Name", sm: 5 },
		{ name: "surname", label: "Surname", sm: 5 },
		{
			name: "gender",
			label: "Gender",
			type: "select",
			options: ["Male", "Female", "Other"],
			sm: 6,
		},
		{ name: "DOB", label: "DOB", type: "date", sm: 6 },
	];

	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
			<DialogTitle>
				{patientData ? "Update Patient" : "Add New Patient"}
			</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Please fill out the form below to {patientData ? "update" : "add"} a
					patient.
				</DialogContentText>
				<Grid container spacing={2}>
					{formFields.map((field) => (
						<Grid item xs={12} sm={field.sm} key={field.name}>
							{field.type === "select" ? (
								<SelectField
									name={field.name}
									label={field.label}
									value={formData[field.name]}
									onChange={handleChange}
									options={field.options}
									fullWidth
								/>
							) : (
								<FormField
									InputLabelProps={{ shrink: true }}
									name={field.name}
									label={field.label}
									value={formData[field.name]}
									onChange={handleChange}
									type={field.type || "text"}
									disabled={field.disabled}
									fullWidth
								/>
							)}
						</Grid>
					))}
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button
					variant="contained"
					onClick={handleSubmit}
					color="primary"
					disabled={isSubmitting}
				>
					{isSubmitting
						? patientData
							? "Updating..."
							: "Adding..."
						: patientData
						? "Update Patient"
						: "Add Patient"}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default PatientPopup;
