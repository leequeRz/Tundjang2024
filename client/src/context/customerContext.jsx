import React, { createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const CustomerContext = createContext();

const apiUrl =
  process.env.NODE_ENV === "development" &&
  process.env.REACT_APP_NODE_ENV === "development"
    ? process.env.REACT_APP_API_URL_DEV
    : process.env.REACT_APP_API_URL_PROD;

const fetchCustomers = async () => {
  const response = await fetch(`${apiUrl}/customer`);
  // console.log("Fetching Customer");
  if (!response.ok) throw new Error("Error fetching Customers");
  return response.json();
};

export const CustomerProvider = ({ children }) => {
  const queryClient = useQueryClient();

  // Query to fetch all Customer
  const {
    data: customers = [], // Default to an empty array to avoid undefined issues
    isLoading,
    isError,
    refetch,
  } = useQuery(["customers"], fetchCustomers, {
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
  });

  // Mutation to delete a Customer
  const deleteCustomer = useMutation(
    async (customer_id) => {
      const response = await fetch(`${apiUrl}/customer/${customer_id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete the Customer");
      return response.json();
    },
    {
      onSuccess: (_, customer_id) => {
        queryClient.setQueryData(["customers"], (oldCustomers = []) =>
          oldCustomers.filter(
            (customer) => customer.customer_id !== customer_id
          )
        );
      },
      onError: (error) => {
        console.error("Error deleting Customer:", error);
      },
    }
  );

  // Mutation to add a new Customer
  const addCustomer = useMutation(
    async (customer) => {
      const response = await fetch(`${apiUrl}/customer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customer),
      });
      if (!response.ok) throw new Error("Error adding Customer");
      return customer;
    },
    {
      onSuccess: (newCustomer) => {
        console.log(newCustomer);
        queryClient.setQueryData(["customers"], (oldCustomers = []) => [
          ...oldCustomers,
          newCustomer,
        ]);
      },
      onError: (error) => {
        console.error("Error adding Customer:", error);
      },
    }
  );

  // Mutation to update an existing Customer
  const updateCustomer = useMutation(
    async (customer) => {
      const response = await fetch(
        `${apiUrl}/customer/${customer.customer_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(customer),
        }
      );
      if (!response.ok) throw new Error("Error updating Customer");
      return customer;
    },
    {
      onSuccess: (updatedCustomer) => {
        queryClient.setQueryData(["customers"], (oldCustomers = []) =>
          oldCustomers.map((customer) =>
            customer.customer_id === updatedCustomer.customer_id
              ? updatedCustomer
              : customer
          )
        );
      },
      onError: (error) => {
        console.error("Error updating Customer:", error);
      },
    }
  );

  return (
    <CustomerContext.Provider
      value={{
        customers,
        isLoading,
        isError,
        deleteCustomer: deleteCustomer.mutate,
        addCustomer: addCustomer.mutate,
        updateCustomer: updateCustomer.mutate,
        refetchCustomers: refetch, // Expose the refetch function
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomers = () => useContext(CustomerContext);
