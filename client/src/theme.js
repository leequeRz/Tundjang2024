// theme.js
import { createTheme } from "@mui/material/styles";

// Create a theme instance.
const theme = createTheme({
	components: {
		MuiFormLabel: {
			styleOverrides: {
				asterisk: {
					color: "red",
				},
			},
		},
	},
});

export default theme;
