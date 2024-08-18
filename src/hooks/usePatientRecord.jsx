import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const usePatientRecord = (HN) => {
	const queryClient = useQueryClient();

	const fetchPatientRecord = async () => {
		const { data } = await axios.get(
			`http://localhost:3000/api/v1/patient/${HN}/record`
		);
		return data;
	};

	const {
		data: record,
		isLoading,
		isError,
	} = useQuery(["patientRecord", HN], fetchPatientRecord, {
		enabled: !!HN, // Only run if HN is present
		staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
		cacheTime: 30 * 60 * 1000, // Keep data in cache for 30 minutes
		onSuccess: (data) => {
			queryClient.setQueryData(["patientRecord", HN], data);
		},
	});

	return { record, isLoading, isError };
};

export default usePatientRecord;
