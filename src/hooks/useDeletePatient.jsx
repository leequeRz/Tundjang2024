import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeletePatient = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (HN) => {
			const response = await fetch(
				`http://localhost:3000/api/v1/patient/${HN}`,
				{
					method: "DELETE",
				}
			);
			if (!response.ok) {
				throw new Error("Failed to delete the patient");
			}
			return response.json();
		},
		onSuccess: () => {
			// Invalidate and refetch the patients data
			queryClient.invalidateQueries("patients");
		},
		onError: (error) => {
			console.error("Error deleting patient:", error);
			// Optionally, display an error message to the user
		},
	});
};
