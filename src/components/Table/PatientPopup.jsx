import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	TextField,
	Button,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Grid,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";

const PatientPopup = ({ open, onClose, patientData }) => {
	const [formData, setFormData] = useState({
		HN: "",
		prefix: "",
		name: "",
		surname: "",
		gender: "",
		DOB: "",
	});

	const mutation = useMutation({
		mutationFn: async (patient) => {
			const url = patientData
				? `http://localhost:3000/api/v1/patients/${patient.HN}`
				: `http://localhost:3000/api/v1/patients/create`;
			const method = patientData ? "PUT" : "POST";
			const response = await fetch(url, {
				method,
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(patient),
			});

			if (!response.ok) {
				throw new Error(`Error ${patientData ? "updating" : "adding"} patient`);
			}
			return response.json();
		},
		onSuccess: () => {
			onClose(); // Close the dialog after successful submission
		},
		onError: (error) => {
			console.error("Error:", error);
		},
	});

	useEffect(() => {
		if (patientData) {
			setFormData({
				HN: patientData.HN || "",
				prefix: patientData.prefix || "",
				name: patientData.name || "",
				surname: patientData.surname || "",
				gender: patientData.gender || "",
				DOB: patientData.DOB || "",
			});
		} else {
			setFormData({
				HN: "",
				prefix: "",
				name: "",
				surname: "",
				gender: "",
				DOB: "",
			});
		}
	}, [patientData]);

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = () => {
		mutation.mutate(formData);
	};

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
					<Grid item xs={12}>
						<TextField
							margin="dense"
							label="Hospital Name"
							name="HN"
							fullWidth
							variant="outlined"
							value={formData.HN}
							onChange={handleChange}
							disabled={!!patientData} // Disable HN field if updating
						/>
					</Grid>
					<Grid item xs={12} sm={2}>
						<FormControl fullWidth margin="dense">
							<InputLabel>Prefix</InputLabel>
							<Select
								name="prefix"
								value={formData.prefix}
								onChange={handleChange}
								variant="outlined"
							>
								<MenuItem value="Mr.">Mr.</MenuItem>
								<MenuItem value="Mrs.">Mrs.</MenuItem>
								<MenuItem value="Ms.">Ms.</MenuItem>
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={5}>
						<TextField
							margin="dense"
							label="Name"
							name="name"
							fullWidth
							variant="outlined"
							value={formData.name}
							onChange={handleChange}
						/>
					</Grid>
					<Grid item xs={12} sm={5}>
						<TextField
							margin="dense"
							label="Surname"
							name="surname"
							fullWidth
							variant="outlined"
							value={formData.surname}
							onChange={handleChange}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<FormControl fullWidth margin="dense">
							<InputLabel>Gender</InputLabel>
							<Select
								name="gender"
								value={formData.gender}
								onChange={handleChange}
								variant="outlined"
							>
								<MenuItem value="Male">Male</MenuItem>
								<MenuItem value="Female">Female</MenuItem>
								<MenuItem value="Other">Other</MenuItem>
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							margin="dense"
							label="DOB"
							name="DOB"
							type="date"
							fullWidth
							variant="outlined"
							InputLabelProps={{ shrink: true }}
							value={formData.DOB}
							onChange={handleChange}
						/>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button
					variant="contained"
					onClick={handleSubmit}
					color="primary"
					disabled={mutation.isLoading}
				>
					{mutation.isLoading
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
