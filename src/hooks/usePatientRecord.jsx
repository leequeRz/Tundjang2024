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
		refetch,
	} = useQuery({
		queryKey: ["patientRecord", HN],
		queryFn: fetchPatientRecord,
		enabled: !!HN,
		staleTime: 5 * 60 * 1000,
		cacheTime: 30 * 60 * 1000,
	});

	return { record, isLoading, isError };
};

export default usePatientRecord;
