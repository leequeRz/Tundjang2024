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
import { useCustomerForm } from "../../hooks/useCustomerForm";
import { FormField, SelectField } from "./FormComponents";
// import RecordPopup from "./RecordPopup copy";
// import ThaiYearDatePicker from "../ThaiYearDatePicker";
// import dayjs from "dayjs";

const RecordPopup = ({ open, onClose, customerData }) => {
	const { formData, handleChange, handleSubmit, isSubmitting } = useCustomerForm(
		customerData,
		onClose
	);

	const formFields = [
		{ name: "customer_id", label: "Customer ID", disabled: !!customerData, sm: 12 },

		{ name: "name", label: "ชื่อ", sm: 6 },
		{ name: "surname", label: "นามสกุล", sm: 6 },
		{name: "phone", label: "โทร", sm: 6 },
		{name: "tel", label: "tel_company", sm: 6 },
		{
			name: "role",
			label: "ตำแหน่ง",
			type: "select",
			options: ["เด็กเดิน", "เด็กเชียร์เบียร์", "รด."],
			sm: 2,
		},

	];

	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
			<DialogTitle>
				{customerData ? "Update Customer" : "Add New Customer"}
			</DialogTitle>
			<DialogContent>
				<DialogContentText>
					Please fill out the form below to {customerData ? "update" : "add"} a
					Customer.
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
							) : field.type === "date" ? (
								field.component
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
						? customerData
							? "Updating..."
							: "Adding..."
						: customerData
						? "Update Customer"
						: "Add Customer"}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default RecordPopup;
