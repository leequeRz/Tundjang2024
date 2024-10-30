import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import { useCustomerForm } from "../../hooks/useCustomerForm";
import { FormField, SelectField } from "./FormComponents";
// import ThaiYearDatePicker from "../ThaiYearDatePicker";
// import dayjs from "dayjs";

const CustomerPopup = ({ open, onClose, customerData }) => {
  const { formData, handleChange, handleSubmit, isSubmitting } =
    useCustomerForm(customerData, onClose);

  const formFields = [
    {
      name: "customer_id",
      label: "รหัสประจำตัวพนักงาน",
      disabled: !!customerData,
      sm: 12,
    },

    { name: "name", label: "ชื่อ", sm: 6 },
    { name: "surname", label: "นามสกุล", sm: 6 },
    {
      name: "role",
      label: "ตำแหน่ง",
      type: "select",
      options: [
        "ผู้อำนวยการ สวท.",
        "เลขานุการ สวท./รองผอ.ฝ่ายบริหารฯ",
        "นักบริหารจัดการเทคโนโลยีเชิงธุรกิจ",
        "นักพัสดุ",
        "นักบริหารงานทั่วไป",
        "นักบัญชี",
        "นักบริหารการเงิน",
        "นักวิเคราะห์แผนและงบประมาณ",
        "พนักงานบริการ",
        "พนักงานช่วยบริหาร",
        "นายช่างเทคนิค",
      ],

      sm: 6,
    },
    {
      name: "group",
      label: "สังกัดกลุ่มหน่วยงาน/หน่วยงาน",
      type: "select",
      options: [
        // "ศูนย์วิจัยและบริการเพื่อชุมชนและสังคม",
        // "ศูนย์เทคโนโลยีชีวมวลบำบัดรักษา",
        // "ศูนย์พัฒนาสินค้าอุตสาหกรรม",
        // "ศูนย์ความเป็นเลิศด้านโลจิสติกส์",
        // "ศูนย์วิจัยและบริการวิศวกรรมการเชื่อม",
        // "ศูนย์บูรณาการเทคโนโลยีเพื่ออุตสาหกรรมไทย",
        // "ศูนย์รับรองระบบมาตรฐานนานาชาติ",
        // "ศูนย์การศึกษาต่อเนื่อง",
        // "ศูนย์อิเล็กทรอนิกส์ยานยนต์",
        // "ศูนย์วิจัยและพัฒนาการขนส่งทางถนน",
        // "ศูนย์ความปลอดภัยอาหาร",
        // "ศูนย์การศึกษาด้านการสื่อสารและการบริการครบวงจร",
        // "ศูนย์กลยุทธ์และความสามารถทางการแข่งขันขององค์กร",
        // "ศูนย์วิจัย Mobility & Vehicle Technology Research Center",
        "สนอ. ผู้อำนวยการ สวท.",
      ],
      sm: 6,
    },
    { name: "phone", label: "โทร", type: "number", sm: 6 },
    { name: "tel", label: "หมายเลขโทรศัพท์ภายใน", type: "number", sm: 6 },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          {customerData ? "แก้ไขข้อมูลผู้ใช้" : "เพิ่มผู้ใช้ใหม่"}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ fontSize: "20px", mb: 5 }}>
          กรุณา{customerData ? "แก้ไข" : "เพิ่ม"}ข้อมูล โดยข้อมูลต้องมีให้ครบทุกช่องเพื่อ {customerData ? "แก้ไข" : "เพิ่ม"} ผู้ใช้
        </DialogContentText>

        <Grid container spacing={2}>
          {formFields.map((field) => (
            <React.Fragment key={field.name}>
              {/* Label ของฟิลด์ */}
              <Grid
                item
                xs={12}
                sm={6}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "start",
                }}
              >
                <Typography sx={{ fontSize: "20px", fontWeight: "medium" }}>
                  {field.label}
                </Typography>
              </Grid>

              {/* Input ของฟิลด์ */}
              <Grid item xs={12} sm={6}>
                {field.type === "select" ? (
                  <SelectField
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    options={field.options}
                    fullWidth
                    sx={{ fontSize: "16px" }} // เพิ่มขนาดฟอนต์ของ SelectField
                  />
                ) : field.type === "date" ? (
                  field.component
                ) : (
                  <FormField
                    InputLabelProps={{ shrink: true }}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    type={field.type || "text"}
                    disabled={field.disabled}
                    fullWidth
                    sx={{ fontSize: "16px" }} // เพิ่มขนาดฟอนต์ของ FormField
                  />
                )}
              </Grid>
            </React.Fragment>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          sx={{ fontSize: "16px", padding: "10px 20px" }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          color="primary"
          disabled={isSubmitting}
          sx={{ fontSize: "16px", padding: "10px 20px" }}
        >
          {isSubmitting
            ? customerData
              ? "Updating..."
              : "Adding..."
            : customerData
            ? "Update Customer"
            : "Add Customer"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomerPopup;
