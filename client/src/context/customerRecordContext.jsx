// CustomerRecordContext.js
import React, { createContext, useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const CustomerRecordContext = createContext();

const apiUrl =
	process.env.NODE_ENV === "development" &&
	process.env.REACT_APP_NODE_ENV === "development"
		? process.env.REACT_APP_API_URL_DEV
		: process.env.REACT_APP_API_URL_PROD;

// Fetch customer records function
const fetchCustomerRecords = async (customer_id) => {
	const response = await fetch(`${apiUrl}/customer/${customer_id}/record`);
	if (!response.ok) throw new Error("Error fetching customer records");
	return response.json();
};

// Custom hook to fetch customer records
const useFetchRecords = (customer_id) => {
	return useQuery(["customerRecords", customer_id], () => fetchCustomerRecords(customer_id), {
		staleTime: 5 * 60 * 1000,
		cacheTime: 30 * 60 * 1000,
		enabled: !!customer_id,
	});
};

export const CustomerRecordProvider = ({ children }) => {
	const queryClient = useQueryClient();
	const [currentEditRecord, setCurrentEditRecord] = useState({
		customer_id: null,
		docId: { id: "create-new", label: "Create New Record" },
	});

	const deleteRecord = useMutation(
		async ({ customer_id, docId }) => {
			const response = await fetch(`${apiUrl}/customer/${customer_id}/record/${docId}`, {
				method: "DELETE",
			});
			if (!response.ok) throw new Error("Failed to delete the record");
			return response.json();
		},
		{
			onSuccess: (_, { customer_id, docId }) => {
				queryClient.setQueryData(["CustomerRecords", customer_id], (oldRecords = []) =>
					oldRecords.filter((record) => record.id !== docId)
				);
			},
			onError: (error) => {
				console.error("Error deleting record:", error);
			},
		}
	);

	const addRecord = useMutation(
		async ({ customer_id, record }) => {
			const response = await fetch(`${apiUrl}/customer/${customer_id}/record`, {
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
			onSuccess: (newRecord, { customer_id, record }) => {
				// console.log(newRecord, customer_id, record);
				queryClient.setQueryData(["customerRecords", customer_id], (oldRecords = []) => [
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
		async ({ customer_id, record }) => {
			const response = await fetch(
				`${apiUrl}/customer/${customer_id}/record/${record.id}`,
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
			onSuccess: (updateRecord, { customer_id, record }) => {
				// console.log(updateRecord, customer_id, record);
				queryClient.setQueryData(["customerRecords", customer_id], (oldRecords = []) =>
					oldRecords.map((record_) =>
						record_.id === record.id ? updateRecord.data : record_
					)
				);
			},
			onError: (error) => {
				console.error("Error updating record:", error);
			},
		}
	);

	return (
		<CustomerRecordContext.Provider
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
		</CustomerRecordContext.Provider>
	);
};

export const useCustomerRecords = () => useContext(CustomerRecordContext);