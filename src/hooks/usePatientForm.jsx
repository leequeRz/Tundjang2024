// usePatientForm.js
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";

export const usePatientForm = (patientData, onClose) => {
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
		}
	}, [patientData]);

	const mutation = useMutation({
		mutationFn: async (patient) => {
			const url = patientData
				? `http://localhost:3000/api/v1/patient/${patient.HN}`
				: `http://localhost:3000/api/v1/patient`;
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
			onClose();
		},
		onError: (error) => {
			console.error("Error:", error);
		},
	});

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = () => {
		mutation.mutate(formData);
	};

	return {
		formData,
		handleChange,
		handleSubmit,
		isSubmitting: mutation.isLoading,
	};
};
