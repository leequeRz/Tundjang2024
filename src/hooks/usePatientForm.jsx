import { useState, useEffect } from "react";
import { usePatients } from "../context/patientContext";

export const usePatientForm = (patientData, onClose) => {
	const { addPatient, updatePatient } = usePatients();
	const [formData, setFormData] = useState({
		HN: "",
		prefix: "",
		name: "",
		surname: "",
		gender: "",
		DOB: "",
	});

	useEffect(() => {
		if (patientData) {
			setFormData(patientData);
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

	const handleSubmit = async () => {
		try {
			if (patientData) {
				await updatePatient(formData);
			} else {
				await addPatient(formData);
			}
			onClose();
		} catch (error) {
			console.error("Error:", error);
		}
	};

	return {
		formData,
		handleChange,
		handleSubmit,
		isSubmitting: false,
	};
};
