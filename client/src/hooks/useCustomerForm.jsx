import { useState, useEffect } from "react";
import { useCustomers } from "../context/customerContext";
// import dayjs from "dayjs";

export const useCustomerForm = (customerData, onClose) => {
  const { addCustomer, updateCustomer } = useCustomers();
  const [formData, setFormData] = useState({
    customer_id: "",
    name: "",
    surname: "",
    phone: "",
    role: "",
    tel:"",
    group:"",
   

    // "customer_id",
    // "customer_name",
    // "phone",
    // "role",
    // "tel_company",
  });

  useEffect(() => {
    if (customerData) {
      setFormData(customerData);
    } else {
      setFormData({
        customer_id: "",
        name: "",
        surname: "",
        phone: "",
        role: "",
        tel:"",
        group:"",
      });
    }
  }, [customerData]);

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
