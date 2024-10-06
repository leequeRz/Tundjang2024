import React from "react";
import { TextField, Button, Typography, Container, Grid } from "@mui/material";
import kmutt from "../../imgs/kmutt.png";
import styles from "./Login.module.scss";
import { useLoginForm } from "../../hooks/useLoginForm";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FA4616", // Orange color
    },
  },
});

const Login = ({ setIsLoggedIn }) => {
  const { credentials, error, handleInputChange, handleLogin, isLoading } =
    useLoginForm(setIsLoggedIn);

  return (
    <Container maxWidth="lg">
      <Grid
        container
        direction={{ xs: "column", md: "row" }} // Stack vertically on small screens, horizontally on larger ones
        justifyContent="center"
        alignItems="center"
        spacing={10}
        style={{ minHeight: "100vh" }} // Full viewport height for vertical centering
      >
        {/* Left side - Image */}
        <Grid item xs={12} md={6}>
          <div style={{ textAlign: "center" }}>
            <img
              src={kmutt}
              alt="avatar"
              style={{
                width: "100%",
                maxWidth: "400px",
                height: "auto",
                objectFit: "contain", // Ensure image fits nicely
              }}
            />
          </div>
        </Grid>

        {/* Right side - Login form */}
        <Grid item xs={12} md={6}>
          <div className={styles.loginContent}>
            <form onSubmit={handleLogin}>
              <Typography
                variant="h3"
                className={styles.loginTitle}
                align="center"
              >
                Log in to your accout
              </Typography>
              <Typography
                variant="subtitle1"
                align="center"
                sx={{ marginTop: 2, marginBottom: 2 }}
              >
                Welcome back! Please login to your account.
              </Typography>
              {error && <Typography color="error">{error}</Typography>}
              <TextField
                label="Enter your Username"
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
              <ThemeProvider theme={theme}>
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
              </ThemeProvider>
            </form>
          </div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Login;
