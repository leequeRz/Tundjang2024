import "./GeneratePDF.css"; // ใส่การจัดการ CSS ในไฟล์นี้
import ThaiFormField from "./ThaiFormfield"; // นำเข้าฟอร์ม
import React, { useRef, useState, useMemo, useCallback } from "react"; // ใช้ useState สำหรับจัดการข้อมูลฟอร์ม
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Grid,
  TextField,
  Divider,
} from "@mui/material"; // นำเข้า Material-UI
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import SearchFilterBarPDF from "../SearchFilterBarPDF"; // นำเข้าคอมโพเนนต์ SearchFilterBar
import SearchFilterBar from "../SearchFilterBar"; // นำเข้าคอมโพเนนต์ SearchFilterBar
import { useCustomers } from "../../context/customerContext";
import { useCustomerRecords } from "../../context/customerRecordContext";
import { formatDateToThai } from "../../utils/helper";

const GeneratePDF = ({ formData, formHeader = {} }) => {
  // กำหนดค่าเริ่มต้นให้กับ formHeader
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
      { id: "create-new", label: "Use only user" },
      ...recordsData.map((record) => ({
        id: record.id,
        label: formatDateToThai(record.id),
      })),
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
    // ดึงข้อมูลลูกค้าและระเบียนที่เลือก
    const selectedCustomer = customers.find(
      (customer) => customer.customer_id === currentEditRecord.customer_id
    );

    const selectedRecord = recordsData.find(
      (record) => record.id === currentEditRecord.docId
    );

    // สร้าง updatedFormProps โดยผสานข้อมูลจาก `selectedCustomer` และ `selectedRecord`
    const updatedFormProps = {
      start_date: selectedRecord?.start_date
        ? formatDateToThai(selectedRecord.start_date)
        : null, // ใช้ข้อมูลจากระเบียนถ้ามี
      end_date: selectedRecord?.end_date
        ? formatDateToThai(selectedRecord.end_date)
        : null,
      item: selectedRecord?.item || "",
      count: selectedRecord?.count || "",
      item_number: selectedRecord?.item_number || "",
      status: selectedRecord?.status || "",
      detail: selectedRecord?.detail || "",
      name: selectedCustomer
        ? `${selectedCustomer.name} ${selectedCustomer.surname}`
        : "", // ดึงข้อมูลชื่อจากลูกค้าที่เลือก
      role: selectedCustomer?.role || "",
      group: selectedCustomer?.group || "",
      phone: selectedCustomer?.phone || "",
      tel: selectedCustomer?.tel || "",
    };

    console.log("Updating form with props:", updatedFormProps);
    setInitialFormProps(updatedFormProps); // อัปเดตค่า initialFormProps
  };

  return (
    <div>
      {/* Navbar */}
      <AppBar position="static" gutterBottom sx={{ marginY: 3 }}>
        <Toolbar
          sx={{
            backgroundColor: "#FFCF9D", // สีส้มแดง
            color: "#CC4626",
          }}
        >
          <Typography variant="h6">สร้างเอกสารยืมอุปกรณ์</Typography>
        </Toolbar>
      </AppBar>

      {/* ฟอร์มข้อมูลผู้ยืมอุปกรณ์ */}
      <form
        gutterBottom
        sx={{ marginY: 6 }}
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <Grid item xs={12} container spacing={0} margin="normal">
          <Grid item xs={6}>
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
              label="เลือกผู้ยืมอุปกรณ์"
              placeholder="ค้นหาผู้ยืม จาก ชื่อ รหัส"
              required={true}
            />
          </Grid>

          {Object.entries(formHeader).map(([key, value]) => (
            <Grid item xs={6} sm={6} key={key}>
              <TextField
                label={key}
                value={value}
                InputProps={{ readOnly: true }} // ทำให้ฟิลด์อ่านอย่างเดียว
                fullWidth
              />
            </Grid>
          ))}

          <Grid item xs={3}>
            <SearchFilterBarPDF
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
              label="เลือกข้อมูลการยืม"
              // placeholder="Search by record id"
              required={true}
            />
          </Grid>

          {/* ปุ่มสำหรับอัปเดตค่าใน ThaiFormField */}
          <Grid
            item
            xs={3}
            display="flex"
            justifyContent="flex-end"
            spacing={2}
          >
            <Button
              variant="contained"
              onClick={handleUpdateForm}
              style={{ marginRight: "10px" }} // กำหนดระยะห่างระหว่างปุ่ม
              sx={{
                backgroundColor: "#FF5733", // สีส้มแดง
                color: "white",
                "&:hover": {
                  backgroundColor: "#CC4626", // สีเมื่อเอาเมาส์ไปวาง
                },
                marginRight: "10px",
              }}
            >
              วางข้อมูลลงกระดาษ
            </Button>
            <Button
              variant="contained"
              onClick={downloadPDF}
              sx={{
                backgroundColor: "#FF5733", // สีส้มแดง
                color: "white",
                "&:hover": {
                  backgroundColor: "#CC4626", // สีเมื่อเอาเมาส์ไปวาง
                },
                marginRight: "10px",
              }}
            >
              ดาวน์โหลด PDF
            </Button>
          </Grid>
        </Grid>
      </form>
      <Divider sx={{ marginY: "3rem" }} />
      <Typography
        variant="h6"
        gutterBottom
        sx={{ alignItems: "center", marginBottom: "20px" }}
      >
        เอกสารประกอบการยืม
      </Typography>

      <div className="a4-page" ref={pdfRef}>
        <ThaiFormField initialFormProps={initialFormProps} />
        {console.log(
          "Rendering ThaiFormField with initialFormProps:",
          initialFormProps
        )}
      </div>
    </div>
  );
};

export default GeneratePDF;
