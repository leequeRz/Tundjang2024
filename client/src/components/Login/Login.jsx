import React from "react";
import { TextField, Button, Typography, Container, Grid } from "@mui/material";
import Nurse from "../../imgs/Nurse.jpg";
import styles from "./Login.module.scss";
import { useLoginForm } from "../../hooks/useLoginForm";

const Login = ({ setIsLoggedIn }) => {
	const { credentials, error, handleInputChange, handleLogin, isLoading } =
		useLoginForm(setIsLoggedIn);

	return (
		<Container maxWidth="lg">
			<Grid
				container
				direction="row"
				justifyContent="center"
				alignItems="center"
				columnSpacing={10}
				rowSpacing={2}
				style={{ minHeight: "100vh" }} // Full viewport height to center vertically
			>
				<Grid item xs={12} sm={8} md={6} lg={4}>
					<div className={styles.loginContent}>
						<form onSubmit={handleLogin}>
							<div className={styles.iconPage} style={{ textAlign: "center" }}>
								<img src={Nurse} alt="avatar" />
							</div>
							<Typography
								variant="h3"
								className={styles.loginTitle}
								align="center"
							>
								Login
							</Typography>
							{error && (
								<Typography color="error">
									{error}
								</Typography>
							)}
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
								style={{ marginTop: "16px" }}
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
