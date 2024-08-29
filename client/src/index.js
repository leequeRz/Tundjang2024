import { React, StrictMode } from "react";
import ReactDOM from "react-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import { ThemeProvider } from "@mui/material/styles";
import { PatientProvider } from "./context/patientContext";
import { PatientRecordProvider } from "./context/patientRecordContext";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import theme from "./theme";

const queryClient = new QueryClient();

ReactDOM.render(
	<QueryClientProvider client={queryClient}>
		<ThemeProvider theme={theme}>
			<PatientProvider>
				<PatientRecordProvider>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<StrictMode>
							<App />
						</StrictMode>
					</LocalizationProvider>
				</PatientRecordProvider>
			</PatientProvider>
		</ThemeProvider>
	</QueryClientProvider>,
	document.getElementById("root")
);
