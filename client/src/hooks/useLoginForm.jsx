// src/components/Login/useLoginForm.jsx
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const apiUrl =
  process.env.NODE_ENV === "development" &&
  process.env.REACT_APP_NODE_ENV === "development"
    ? process.env.REACT_APP_API_URL_DEV
    : process.env.REACT_APP_API_URL_PROD;
// console.log(process.env)

export const useLoginForm = (setIsLoggedIn) => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (credentials) => {
      const response = await fetch(`${apiUrl}/users/login`, {
        method: "POST",
        headers: {
          Accept: "text/plain",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error("Something went wrong. Please try again later.");
      }

      const data = await response.json();
      if (data.message !== "success") {
        throw new Error("Invalid credentials");
      }

      return data;
    },
    onSuccess: () => {
      localStorage.setItem("token", "someToken");
      setIsLoggedIn(true);
      navigate("/main");
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    mutation.mutate(credentials);
  };

  return {
    credentials,
    error,
    handleInputChange,
    handleLogin,
    isLoading: mutation.isLoading,
  };
};
