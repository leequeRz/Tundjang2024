import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Container,
  Divider,
  Typography,
  Select,
  MenuItem,
  TextField,
  Button,
  Box,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
// import { formatDateToThaiDayJS } from "../../utils/helper";
import SearchFilterBar from "../SearchFilterBar";
import { useSearch } from "../../hooks/useSearch";
import { useCustomers } from "../../context/customerContext";
import { useCustomerRecords } from "../../context/customerRecordContext";
import ThaiYearDatePicker from "../ThaiYearDatePicker";
import ThaiYearDatePickerEnd from "../ThaiYearDatePickerEnd";
import dayjs from "dayjs";


const defaultDate = dayjs();

const initialFormState = {
  start_date: defaultDate,
  end_date: defaultDate,
  item: "",
  count: "",
  item_number: "",
  status: "ยืม",
  detail: "",
};

const Form = () => {
  const currentDate = new Date().toLocaleDateString();
  const [formHeader, setFormHeader] = useState({
    customer_id: "",
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
  const {
    searchTerm: recordSearchTerm,
    setSearchTerm: setRecordSearchTerm,
    filteredItems: filteredRecords,
  } = useSearch(recordOptions, ["label"]);

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
      const selectedRecord = records.find((record) => record.id === value.id);
      if (selectedRecord) {
        // อัปเดต form ด้วยค่าจาก selectedRecord
        setForm({
          ...initialFormState, // เริ่มต้นจาก initialFormState
          ...selectedRecord, // เติมค่าจาก selectedRecord
        });
      } else {
        setForm(initialFormState); // รีเซ็ตฟอร์มถ้าไม่พบ Record
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

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

 

  return (
    <Container maxWidth="md">
      <Typography variant="h3" gutterBottom sx={{ marginY: 6 }}>
        บันทึกรายการยืม ประจำวันที่ {currentDate}
      </Typography>
      <Typography variant="h4" gutterBottom>
        ส่วนที่ 1 ข้อมูลผู้ยืมอุปกรณ์
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} margin="normal">
          <Grid item xs={12} sm={12}>
            <SearchFilterBar
              searchTerm={customerSearchTerm}
              setSearchTerm={setCustomerSearchTerm}
              selectedValue={currentEditRecord.customer_id}
              filterItems={filteredCustomers}
              onFilterSelected={handleSelectCustomer_idFilter}
              label="Customer ID"
              placeholder="Search by ID , name or surname"
              required={true}
            />
          </Grid>
          {Object.entries(formHeader).map(([key, value]) => (
            <Grid item xs={12} sm={6} key={key}>
              <TextField
                label={key}
                value={value}
                InputProps={{ readOnly: true }}
                fullWidth
              />
            </Grid>
          ))}

          <Grid item xs={12} sm={12}>
            <SearchFilterBar
              searchTerm={recordSearchTerm}
              setSearchTerm={setRecordSearchTerm}
              selectedValue={currentEditRecord.docId}
              filterItems={filteredRecords}
              onFilterSelected={handleSelectRecordFilter}
              label="customer Record"
              placeholder="Search by record id"
              required={true}
            />
          </Grid>
        </Grid>

        {formHeader.customer_id && (
          <>
            <Divider sx={{ marginY: "3rem" }} />
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography variant="body1">
                customer_id: {formHeader.customer_id}
              </Typography>
              <Typography variant="body1">
                Name: {formHeader["name surname"]}
              </Typography>
              <Typography variant="body1">Role: {formHeader.role}</Typography>
              <Typography variant="body1">
                Telephone company: {formHeader.tel}
              </Typography>
              {/* <Typography variant="body1">Shift: {form.shift}</Typography> */}
            </Box>

            <Typography variant="h4" gutterBottom>
              ส่วนที่ 2 ข้อมูลครุภัณฑ์
            </Typography>
            <Grid container spacing={2} marginBottom={2}>
              <Grid
                item
                xs={6}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "start",
                }}
              >
                <span style={{ fontSize: "25px" }}>ครุภัณฑ์</span>{" "}
                {/* เพิ่มขนาดตัวหนังสือ */}
              </Grid>

              <Grid item xs={6}>
                <TextField
                  name="item"
                  value={form.item}
                  placeholder="พิมพ์ครุภัณฑ์ที่นี่"
                  fullWidth
                  InputProps={{ style: { fontSize: "18px" } }} // เพิ่มขนาดตัวหนังสือของ input
                  onChange={handleFormChange}
                />
              </Grid>

              <Grid
                item
                xs={6}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "start",
                }}
              >
                <span style={{ fontSize: "25px" }}>จำนวน</span>{" "}
                {/* เพิ่มขนาดตัวหนังสือ */}
              </Grid>

              <Grid item xs={6}>
                <TextField
                  name="count"
                  type="number"
                  value={form.count}
                  placeholder="พิมพ์จำนวนครุภัณฑ์ที่นี่"
                  fullWidth
                  InputProps={{ style: { fontSize: "18px" } }} // เพิ่มขนาดตัวหนังสือของ input
                  onChange={handleFormChange}
                />
              </Grid>
              <Grid
                item
                xs={6}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "start",
                }}
              >
                <span style={{ fontSize: "25px" }}>หมายเลขครุภัณฑ์</span>{" "}
                {/* เพิ่มขนาดตัวหนังสือ */}
              </Grid>

              <Grid item xs={6}>
                <TextField
                  name="item_number"
                  // label="หมายเลขครุภัณฑ์"  // ลบ label ที่ซ้ำกันออก
                  value={form.item_number}
                  placeholder="พิมพ์หมายเลขครุภัณฑ์ที่นี่"
                  fullWidth
                  InputProps={{ style: { fontSize: "18px" } }} // เพิ่มขนาดตัวหนังสือของ input
                  onChange={handleFormChange}
                />
              </Grid>

              {/* <Grid
                item
                xs={6}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "start",
                }}
              >
                <span style={{ fontSize: "25px" }}>วัตถุประสงค์เพื่อ</span>{" "}
     
              </Grid>

              <Grid item xs={6}>
                <TextField
                  name="detail"
                  // label="หมายเลขครุภัณฑ์"  // ลบ label ที่ซ้ำกันออก
                  value={form.detail}
                  placeholder="พิมพ์หมายเหตุที่นี่"
                  fullWidth
                  InputProps={{ style: { fontSize: "18px" } }} // เพิ่มขนาดตัวหนังสือของ input
                  onChange={handleFormChange}
                />
              </Grid> */}

              <Grid
                item
                xs={6}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "start",
                }}
              >
                <span style={{ fontSize: "25px" }}>เริ่มตั้งแต่วันที่</span>{" "}
                {/* เพิ่มขนาดตัวหนังสือ */}
              </Grid>
              <Grid
                item
                xs={6}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "start",
                }}
              >
                <span style={{ fontSize: "25px" }}>ถึงวันที่</span>{" "}
                {/* เพิ่มขนาดตัวหนังสือ */}
              </Grid>
              <Grid item xs={6}>
                <ThaiYearDatePicker
                  name="start_date"
                  label="ตั้งแต่วันที่"
                  value={form.start_date}
                  inputFormat="dd/MM/yyyy" // รูปแบบวันที่ที่ต้องการ
                  views={["year", "month", "day"]} // สามารถเลือกปี-เดือน-วัน
                  onChange={(newValue) =>
                    handleFormChange({ target: { name: "start_date", value: newValue } })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      InputProps={{ style: { fontSize: "18px" } }}
                    />
                  )}
                />
      
            </Grid>

            <Grid item xs={6}>

              <ThaiYearDatePickerEnd
                name="end_date"
                label="ถึงวันที่"
                value={form.end_date}
                inputFormat="dd/MM/yyyy" // รูปแบบวันที่ที่ต้องการ
                views={["year", "month", "day"]} // สามารถเลือกปี-เดือน-วัน
                onChange={(newValue) =>
                  handleFormChange({ target: { name: "end_date", value: newValue } })
                }
                // อนุญาตให้เลือกวันในอนาคตได้
             
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    InputProps={{ style: { fontSize: "18px" } }}
                  />
                )}
              />

       
            </Grid>

            </Grid>

            <Divider sx={{ marginY: "3rem" }} />

            <Typography variant="h6" gutterBottom>
                วัตถุประสงค์เพื่อ
            </Typography>
            <TextField
              placeholder="พิมพ์หมายเหตุเพิ่มเติมที่นี่"
              name="detail"
              value={form.detail}
              multiline
              rows={4}
              fullWidth
              margin="normal"
              onChange={handleFormChange}
            />
            <Divider sx={{ marginY: "3rem" }} />

            <Grid container spacing={2} marginBottom={2}>
              <Grid
                item
                xs={6}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "start",
                }}
              >
                <span style={{ fontSize: "25px" }}>สถานะปัจจุบัน</span>{" "}
                {/* เพิ่มขนาดตัวหนังสือ */}
              </Grid>

              <Grid item xs={6}>
                <Select
                  name="status"
                  value={form.status}
                  fullWidth
                  onChange={handleFormChange}
                  style={{
                    textAlign: "center",
                    justifyContent: "center" ,
                    fontSize: "20px",
                    color: form.status === "ยืม" ? "red" : form.status === "คืนแล้ว" ? "green" : "inherit",
                  }}
                  MenuProps={{
                    PaperProps: {
                      style: {

                        textAlign: "center", // กำหนดให้ข้อความในเมนูอยู่กึ่งกลาง
                      },
                    },
                  }}
                >
                  <MenuItem
                    value="ยืม"
                    style={{ color: "orange", justifyContent: "center" }} // กำหนดให้ข้อความในเมนูอยู่กึ่งกลาง
                  >
                    ยืม
                  </MenuItem>
                  <MenuItem
                    value="คืนแล้ว"
                    style={{ color: "green", justifyContent: "center" }} // กำหนดให้ข้อความในเมนูอยู่กึ่งกลาง
                  >
                    คืนแล้ว
                  </MenuItem>
                </Select>
              </Grid>
              </Grid>

            <Box marginTop={5} marginBottom={15}
             style={{
                textAlign: "center",
                justifyContent: "center",
                // width:"900px"
              }}>
              <Button type="submit" variant="contained" color="primary" >
                บันทึกข้อมูล
              </Button>
            </Box>
          </>
        )}
      </form>
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
      >
        <Alert
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          onClose={handleCloseAlert}
          severity={alert.severity}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Form;
