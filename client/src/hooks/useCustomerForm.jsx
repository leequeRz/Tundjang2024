import { useState, useEffect } from "react";
import { useCustomers } from "../context/customerContext";

export const useCustomerForm = (customerData, onClose) => {
  const { addCustomer, updateCustomer, refetchCustomers, customers } = useCustomers(); // Extract customers from context
  const [formData, setFormData] = useState({
    customer_id: "",
    name: "",
    surname: "",
    phone: "",
    role: "",
    tel: "",
    group: "",
  });

  useEffect(() => {
    if (customerData) {
      setFormData(customerData);
    } else {
      setFormData({
        customer_id: generateNextCustomerId(), // Generate customer ID
        name: "",
        surname: "",
        phone: "",
        role: "",
        tel: "",
        group: "",
      });
    }
  }, [customerData]);

  const generateNextCustomerId = () => {
    // Ensure customers array is available
    if (!customers || customers.length === 0) return "KM0001";

    const lastCustomerId = customers
      .map((customer) => parseInt(customer.customer_id.replace("KM", "")))
      .filter((id) => !isNaN(id))
      .sort((a, b) => b - a)[0];

    const nextCustomerId = (lastCustomerId || 0) + 1;
    return `KM${String(nextCustomerId).padStart(4, "0")}`;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      if (customerData) {
        await updateCustomer(formData);
      } else {
        await addCustomer(formData);
        await refetchCustomers(); // Fetch updated customer list
      }
      onClose();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    isSubmitting: false,
  };
};
