import "./GeneratePDF.css"; // ใส่การจัดการ CSS ในไฟล์นี้
import ThaiFormField from "./ThaiFormfield"; // นำเข้าฟอร์ม
import React, { useRef, useState, useMemo, useCallback } from "react"; // ใช้ useState สำหรับจัดการข้อมูลฟอร์ม
import { AppBar, Toolbar, Typography, Button, Grid, TextField } from "@mui/material"; // นำเข้า Material-UI
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import SearchFilterBar from "../SearchFilterBar"; // นำเข้าคอมโพเนนต์ SearchFilterBar
import { useCustomers } from "../../context/customerContext";
import { useCustomerRecords } from "../../context/customerRecordContext";

const GeneratePDF = ({ formData, formHeader = {} }) => { // กำหนดค่าเริ่มต้นให้กับ formHeader
  const pdfRef = useRef();
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [recordSearchTerm, setRecordSearchTerm] = useState("");
  const [currentEditRecord, setCurrentEditRecord] = useState({}); // สมมติว่าใช้สำหรับบันทึกข้อมูลที่แก้ไข
  const [initialFormProps, setInitialFormProps] = useState({}); // สำหรับส่งข้อมูลไปยัง ThaiFormField

  const { useFetchRecords } = useCustomerRecords();
  const { customers } = useCustomers(); // ดึงข้อมูลลูกค้า

  // ตรวจสอบว่ามีลูกค้าหรือไม่
  const generateLabel = useCallback(
    (item) => `${item.name} ${item.surname} (${item.customer_id})`,
    []
  );

  const records = useFetchRecords(currentEditRecord.customer_id?.trim());
  const recordsData = records?.data || []; // ตรวจสอบว่ามี records หรือไม่

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
      ...recordsData.map((record) => ({ id: record.id, label: record.id })),
    ],
    [recordsData]
  );

  const downloadPDF = () => {
    const input = pdfRef.current;
    html2canvas(input, { scale: 3, useCORS: true }).then((canvas) => {
      const pdf = new jsPDF("p", "mm", "a4", true);

      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = 297; // A4 height in mm
      const contentWidth = pdfWidth; // ใช้ full width
      const imgHeight = (canvas.height * contentWidth) / canvas.width; // Scale image height proportionally

      let position = 0; // Start at the top of the page
      let remainingHeight = imgHeight;
      const imgData = canvas.toDataURL("image/png");

      while (remainingHeight > 0) {
        pdf.addImage(imgData, "PNG", 0, position, contentWidth, imgHeight);
        remainingHeight -= pdfHeight;
        position -= pdfHeight;

        if (remainingHeight > 0) {
          pdf.addPage();
          position = 0; // Reset position for new page
        }
      }

      pdf.save("test.pdf");
    });
  };

  const handleUpdateForm = () => {
    // อัปเดตข้อมูลที่จะส่งไปยัง ThaiFormField
    setInitialFormProps({
      start_date: "01/01/2024",
      end_date: "01/31/2024",
      item: "Laptop",
      count: "2",
      item_number: "12345",
      status: "ยืม",
      detail: "เพื่อการประชุม"
    });
  };

  return (
    <div>
      {/* Navbar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">ข้อมูลผู้ยืมอุปกรณ์</Typography>
          <Button color="inherit" onClick={downloadPDF}>ดาวน์โหลด PDF</Button>
        </Toolbar>
      </AppBar>

      {/* ฟอร์มข้อมูลผู้ยืมอุปกรณ์ */}
      <form onSubmit={(e) => { e.preventDefault(); }}>
        <Grid container spacing={2} margin="normal">
          <Grid item xs={12}>
            <SearchFilterBar
              searchTerm={customerSearchTerm}
              setSearchTerm={setCustomerSearchTerm}
              selectedValue={currentEditRecord.customer_id}
              filterItems={customersOptions} // ใช้ customersOptions แทน
              onFilterSelected={(selectedCustomer) => {
                // ตั้งค่าข้อมูลลูกค้าที่เลือก
                setCurrentEditRecord((prev) => ({
                  ...prev,
                  customer_id: selectedCustomer.id,
                }));
              }}
              label="Customer ID"
              placeholder="Search by ID, name or surname"
              required={true}
            />
          </Grid>

          {Object.entries(formHeader).map(([key, value]) => (
            <Grid item xs={12} sm={6} key={key}>
              <TextField
                label={key}
                value={value}
                InputProps={{ readOnly: true }} // ทำให้ฟิลด์อ่านอย่างเดียว
                fullWidth
              />
            </Grid>
          ))}

          <Grid item xs={12}>
            <SearchFilterBar
              searchTerm={recordSearchTerm}
              setSearchTerm={setRecordSearchTerm}
              selectedValue={currentEditRecord.docId}
              filterItems={recordOptions} // ใช้ recordOptions
              onFilterSelected={(selectedRecord) => {
                // ตั้งค่าข้อมูลระเบียนที่เลือก
                setCurrentEditRecord((prev) => ({
                  ...prev,
                  docId: selectedRecord.id,
                }));
              }}
              label="Customer Record"
              placeholder="Search by record id"
              required={true}
            />
          </Grid>

          {/* ปุ่มสำหรับอัปเดตค่าใน ThaiFormField */}
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleUpdateForm}>
              แสดงตัวอย่างข้อมูลฟอร์ม
            </Button>
          </Grid>
        </Grid>
      </form>

      <div className="a4-page" ref={pdfRef}>
        <ThaiFormField initialFormProps={initialFormProps} />
      </div>
    </div>
  );
};

export default GeneratePDF;
