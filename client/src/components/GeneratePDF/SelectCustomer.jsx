import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  // Radio,
  // RadioGroup,
  // FormControlLabel,
  // FormControl,
  // FormLabel,
  TextField,
  Grid,
} from "@mui/material";
// import { formatDateToThaiDayJS } from "../../utils/helper";
import SearchFilterBar from "../SearchFilterBar";
import { useSearch } from "../../hooks/useSearch";
import { useCustomers } from "../../context/customerContext";
import { useCustomerRecords } from "../../context/customerRecordContext";

const SelectCustomer = () => {
  const initialFormState = {
    start_date: null,
    end_date: null,
    item: "",
    count: "",
    // responsible_person: "",
    item_number: "",
    status: "ยืม",
    detail: "",
  };

  const [formHeader, setFormHeader] = useState({
    "name surname": "",
    role: "",
    group: "",
    tel: "",
  });
  const [form, setForm] = useState(initialFormState);
  const [alert, setAlert] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const { customers } = useCustomers();
  const {
    currentEditRecord,
    setCurrentEditRecord,
    useFetchRecords,
    addRecord,
    updateRecord,
  } = useCustomerRecords();

  // console.log(currentEditRecord);
  const { data: records = [] } = useFetchRecords(
    currentEditRecord.customer_id?.trim()
  );

  const generateLabel = useCallback(
    (item) => `${item.name} ${item.surname} (${item.customer_id})`,
    []
  );

  const customersOptions = useMemo(
    () =>
      customers.map((customer) => ({
        id: customer.customer_id,
        label: generateLabel(customer),
      })),
    [customers, generateLabel]
  );

  const recordOptions = useMemo(
    () => [
      { id: "create-new", label: "Create New Record" },
      ...records.map((record) => ({ id: record.id, label: record.id })),
    ],
    [records]
  );
  // const [excretion, setExcretion] = useState([]);
  const {
    searchTerm: customerSearchTerm,
    setSearchTerm: setCustomerSearchTerm,
    filteredItems: filteredCustomers,
  } = useSearch(customersOptions, ["label"]);
  //   const {
  //     searchTerm: recordSearchTerm,
  //     setSearchTerm: setRecordSearchTerm,
  //     filteredItems: filteredRecords,
  //   } = useSearch(recordOptions, ["label"]);

  const handleSelectCustomer_idFilter = useCallback(
    (value) => {
      setCurrentEditRecord({
        customer_id: value.id,
        docId: { id: "create-new", label: "Create New Record" },
      });
      const selectedCustomer = customers.find(
        (customer) => customer.id === value.id
      );
      if (selectedCustomer) {
        setFormHeader({
          customer_id: selectedCustomer.customer_id.trim(),
          "name surname": `${selectedCustomer.name} ${selectedCustomer.surname}`,
          role: selectedCustomer.role,
          group: selectedCustomer.group,
          tel: selectedCustomer.tel,
        });
        setForm(initialFormState);
      }
    },
    [customers, setCurrentEditRecord]
  );

  const handleSelectRecordFilter = useCallback(
    (value) => {
      setCurrentEditRecord((prev) => ({ ...prev, docId: value }));
      const selectedRecord = records.find((record) => record.id === value);
      if (selectedRecord) {
        setForm((prev) => ({
          ...prev,
          ...selectedRecord,
          food_type: selectedRecord.food_type || [""],
        }));
      } else {
        setForm(initialFormState);
      }
    },
    [records, setCurrentEditRecord]
  );

  useEffect(() => {
    // console.log(currentEditRecord);
    handleSelectCustomer_idFilter({ id: currentEditRecord.customer_id });
    handleSelectRecordFilter(currentEditRecord.docId);
  }, []);

  useEffect(() => {
    console.log("Form state updated:", form);
  }, [form]);

  const handleFormChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();

      const recordData = {
        customer_id: formHeader.customer_id,
        record: {
          ...form,
          id: currentEditRecord.docId.id,
        },
      };

      const options = {
        onSuccess: () => {
          setAlert({
            open: true,
            message: "Record successfully saved!",
            severity: "success",
          });
        },
        onError: () => {
          setAlert({
            open: true,
            message: "An error occurred while saving the record.",
            severity: "error",
          });
        },
      };

      if (
        currentEditRecord.docId &&
        currentEditRecord.docId.id !== "create-new"
      ) {
        updateRecord(recordData, options);
      } else {
        addRecord(recordData, options);
        setForm(initialFormState);
      }
    },
    [
      form,
      formHeader.customer_id,
      currentEditRecord.docId,
      addRecord,
      updateRecord,
    ]
  );

  return (
    <form onSubmit={handleSubmit}>
      <Grid>
        <Grid item xs={12} sm={12}>
          <SearchFilterBar
            searchTerm={customerSearchTerm}
            setSearchTerm={setCustomerSearchTerm}
            selectedValue={currentEditRecord.customer_id}
            filterItems={filteredCustomers}
            onFilterSelected={handleSelectCustomer_idFilter}
            label="Customer ID"
            required={true}
          />
        </Grid>
        {Object.entries(formHeader).map(([key, value]) => (
          <Grid item xs={12} sm={6} key={key}>
            <TextField
              label={key}
              value={value}
              InputProps={{ readOnly: true, disableUnderline: false }} // Keeps the underline visible
              fullWidth
              variant="standard"
              sx={{
                width: "250px", // Set a fixed width (you can adjust this as needed)
                "& .MuiInput-underline:before": {
                  borderBottom: "1px dotted", // Dotted underline
                },
              }}
            />
          </Grid>
        ))}
      </Grid>
    </form>
  );
};

export default SelectCustomer;
