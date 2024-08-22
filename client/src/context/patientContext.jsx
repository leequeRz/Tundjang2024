import React, { createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const PatientContext = createContext();

const apiUrl =
	process.env.NODE_ENV === "development" &&
	process.env.REACT_APP_NODE_ENV === "development"
		? process.env.REACT_APP_API_URL_DEV
		: process.env.REACT_APP_API_URL_PROD;

const fetchPatients = async () => {
	const response = await fetch(`${apiUrl}/patient`);
	console.log("Fetching Patient");
	if (!response.ok) throw new Error("Error fetching patients");
	return response.json();
};

export const PatientProvider = ({ children }) => {
	const queryClient = useQueryClient();

	// Query to fetch all patients
	const {
		data: patients = [], // Default to an empty array to avoid undefined issues
		isLoading,
		isError,
		refetch,
	} = useQuery(["patients"], fetchPatients, {
		staleTime: 5 * 60 * 1000,
		cacheTime: 30 * 60 * 1000,
	});

	// Mutation to delete a patient
	const deletePatient = useMutation(
		async (HN) => {
			const response = await fetch(`${apiUrl}/patient/${HN}`, {
				method: "DELETE",
			});
			if (!response.ok) throw new Error("Failed to delete the patient");
			return response.json();
		},
		{
			onSuccess: (_, HN) => {
				queryClient.setQueryData(["patients"], (oldPatients = []) =>
					oldPatients.filter((patient) => patient.HN !== HN)
				);
			},
			onError: (error) => {
				console.error("Error deleting patient:", error);
			},
		}
	);

	// Mutation to add a new patient
	const addPatient = useMutation(
		async (patient) => {
			const response = await fetch(`${apiUrl}/patient`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(patient),
			});
			if (!response.ok) throw new Error("Error adding patient");
			return patient;
		},
		{
			onSuccess: (newPatient) => {
				console.log(newPatient);
				queryClient.setQueryData(["patients"], (oldPatients = []) => [
					...oldPatients,
					newPatient,
				]);
			},
			onError: (error) => {
				console.error("Error adding patient:", error);
			},
		}
	);

	// Mutation to update an existing patient
	const updatePatient = useMutation(
		async (patient) => {
			const response = await fetch(`${apiUrl}/patient/${patient.HN}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(patient),
			});
			if (!response.ok) throw new Error("Error updating patient");
			return patient;
		},
		{
			onSuccess: (updatedPatient) => {
				queryClient.setQueryData(["patients"], (oldPatients = []) =>
					oldPatients.map((patient) =>
						patient.HN === updatedPatient.HN ? updatedPatient : patient
					)
				);
			},
			onError: (error) => {
				console.error("Error updating patient:", error);
			},
		}
	);

	return (
		<PatientContext.Provider
			value={{
				patients,
				isLoading,
				isError,
				deletePatient: deletePatient.mutate,
				addPatient: addPatient.mutate,
				updatePatient: updatePatient.mutate,
				refetchPatients: refetch, // Expose the refetch function
			}}
		>
			{children}
		</PatientContext.Provider>
	);
};

export const usePatients = () => useContext(PatientContext);
