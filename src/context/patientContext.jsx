// PatientContext.js
import React, { createContext, useState, useContext } from "react";

const PatientContext = createContext();

export const PatientProvider = ({ children }) => {
	const [patients, setPatients] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const fetchPatients = async () => {
		setIsLoading(true);
		try {
			const response = await fetch("http://localhost:3000/api/v1/patient");
			console.log(response);
			if (!response.ok) throw new Error("Error fetching data");
			const data = await response.json();
			setPatients(data);
		} catch (err) {
			setError(err.message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<PatientContext.Provider
			value={{ patients, isLoading, error, fetchPatients, setPatients }}
		>
			{children}
		</PatientContext.Provider>
	);
};

export const usePatients = () => useContext(PatientContext);
