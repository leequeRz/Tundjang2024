import { React, StrictMode } from "react";
import ReactDOM from "react-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import { ThemeProvider } from "@mui/material/styles";
import { PatientProvider } from "./context/patientContext";
import theme from "./theme";

const queryClient = new QueryClient();

ReactDOM.render(
	<QueryClientProvider client={queryClient}>
		<ThemeProvider theme={theme}>
			<PatientProvider>
				<StrictMode>
					<App />
				</StrictMode>
			</PatientProvider>
		</ThemeProvider>
	</QueryClientProvider>,
	document.getElementById("root")
);
