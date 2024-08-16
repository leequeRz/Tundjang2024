import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const useAddRecord = () => {
	return useMutation({
		mutationFn: async (data) => {
			const response = await axios.post("/patients/record", data);
			return response.data;
		},
		onSuccess: (data) => {
			console.log("Record added successfully:", data);
		},
		onError: (error) => {
			console.error("Error adding record:", error);
		},
	});
};

export default useAddRecord;
