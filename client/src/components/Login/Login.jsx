import React from "react";
import { TextField, Button, Typography, Container, Grid } from "@mui/material";
import Nurse from "../../imgs/Nurse.jpg";
// import bg from "../../imgs/bg.svg";
import styles from "./Login.module.scss";
import { useLoginForm } from "../../hooks/useLoginForm";
// import "./Login.css"

const Login = ({ setIsLoggedIn }) => {
	const { credentials, error, handleInputChange, handleLogin, isLoading } =
		useLoginForm(setIsLoggedIn);

	return (
		<Container maxWidth="lg">
			<Grid
				container
				direction="row"
				justifyContent="space-evenly"
				alignItems="center"
				columnSpacing={10}
				rowSpacing={2}
			>
				<Grid item xs={4}>
					<div className={styles.loginContent}>
						<form onSubmit={handleLogin}>
							<div className={styles.iconPage}>
								<img src={Nurse} alt="avatar" />
							</div>
							<Typography variant="h3" className={styles.loginTitle}>
								Login
							</Typography>
							{error && <Typography color="error">{error}</Typography>}
							<TextField
								label="Username"
								name="username"
								value={credentials.username}
								onChange={handleInputChange}
								fullWidth
								margin="normal"
								disabled={isLoading}
							/>
							<TextField
								label="Password"
								name="password"
								type="password"
								value={credentials.password}
								onChange={handleInputChange}
								fullWidth
								margin="normal"
								disabled={isLoading}
							/>
							<Button
								type="submit"
								variant="contained"
								color="primary"
								fullWidth
								disabled={isLoading}
							>
								{isLoading ? "Logging in..." : "Login"}
							</Button>
						</form>
					</div>
				</Grid>
			</Grid>
		</Container>
	);
};

export default Login;
