// patientRecordContext.js
import React, { createContext, useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const PatientRecordContext = createContext();

const apiUrl =
	process.env.NODE_ENV === "development" &&
	process.env.REACT_APP_NODE_ENV === "development"
		? process.env.REACT_APP_API_URL_DEV
		: process.env.REACT_APP_API_URL_PROD;

// Fetch patient records function
const fetchPatientRecords = async (HN) => {
	const response = await fetch(`${apiUrl}/patient/${HN}/record`);
	if (!response.ok) throw new Error("Error fetching patient records");
	return response.json();
};

// Custom hook to fetch patient records
const useFetchRecords = (HN) => {
	return useQuery(["patientRecords", HN], () => fetchPatientRecords(HN), {
		staleTime: 5 * 60 * 1000,
		cacheTime: 30 * 60 * 1000,
		enabled: !!HN,
	});
};

export const PatientRecordProvider = ({ children }) => {
	const queryClient = useQueryClient();
	const [currentEditRecord, setCurrentEditRecord] = useState({
		HN: null,
		docId: { id: "create-new", label: "Create New Record" },
	});

	const deleteRecord = useMutation(
		async ({ HN, docId }) => {
			const response = await fetch(`${apiUrl}/patient/${HN}/record/${docId}`, {
				method: "DELETE",
			});
			if (!response.ok) throw new Error("Failed to delete the record");
			return response.json();
		},
		{
			onSuccess: (_, { HN, docId }) => {
				queryClient.setQueryData(["patientRecords", HN], (oldRecords = []) =>
					oldRecords.filter((record) => record.id !== docId)
				);
			},
			onError: (error) => {
				console.error("Error deleting record:", error);
			},
		}
	);

	const addRecord = useMutation(
		async ({ HN, record }) => {
			const response = await fetch(`${apiUrl}/patient/${HN}/record`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(record),
			});
			if (!response.ok) throw new Error("Error adding record");
			return response.json();
		},
		{
			onSuccess: (newRecord, { HN, record }) => {
				console.log(newRecord, HN, record);
				queryClient.setQueryData(["patientRecords", HN], (oldRecords = []) => [
					...oldRecords,
					{
						...record,
						id: newRecord.data.id,
						create_time: newRecord.data.create_time,
					},
				]);
			},
			onError: (error) => {
				console.error("Error adding record:", error);
			},
		}
	);

	const updateRecord = useMutation(
		async ({ HN, record }) => {
			const response = await fetch(
				`${apiUrl}/patient/${HN}/record/${record.id}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(record),
				}
			);
			if (!response.ok) throw new Error("Error updating record");
			return response.json();
		},
		{
			onSuccess: (_, { HN, record }) => {
				queryClient.setQueryData(["patientRecords", HN], (oldRecords = []) =>
					oldRecords.map((record_) =>
						record_.id === record.id ? record_ : record
					)
				);
			},
			onError: (error) => {
				console.error("Error updating record:", error);
			},
		}
	);

	return (
		<PatientRecordContext.Provider
			value={{
				currentEditRecord,
				setCurrentEditRecord,
				useFetchRecords, // Expose the custom hook
				deleteRecord: deleteRecord.mutate,
				addRecord: addRecord.mutate,
				updateRecord: updateRecord.mutate,
			}}
		>
			{children}
		</PatientRecordContext.Provider>
	);
};

export const usePatientRecords = () => useContext(PatientRecordContext);
