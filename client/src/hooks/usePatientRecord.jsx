import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl =
  process.env.NODE_ENV === "development" &&
  process.env.REACT_APP_NODE_ENV === "development"
    ? process.env.REACT_APP_API_URL_DEV
    : process.env.REACT_APP_API_URL_PROD;

const usePatientRecord = (HN) => {
  const queryClient = useQueryClient();

  const fetchPatientRecord = async () => {
    const { data } = await axios.get(`${apiUrl}/patient/${HN}/record`);
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
