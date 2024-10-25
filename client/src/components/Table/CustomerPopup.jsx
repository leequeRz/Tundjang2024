import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Grid,
} from "@mui/material";
import { useCustomerForm } from "../../hooks/useCustomerForm";
import { FormField, SelectField } from "./FormComponents";
import ThaiYearDatePicker from "../ThaiYearDatePicker";
import dayjs from "dayjs";

const CustomerPopup = ({ open, onClose, customerData }) => {
  const { formData, handleChange, handleSubmit, isSubmitting } =
    useCustomerForm(customerData, onClose);

  const handleDateChange = (date) => {
  	// Convert dayjs date to Date object or null
  	const formattedDate = date ? date.format("YYYY-MM-DD") : null;
  	handleChange({ target: { name: "DOB", value: formattedDate } });
  	// console.log(formData);
  };

  const formFields = [
    {
      name: "customer_id",
      label: "Customer ID",
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
        "พนักงานช่วยบริหาร"
    ]
    
      ,sm: 6,
    },
    { 
      name: "group", 
      label: "สังกัดกลุ่มหน่วยงาน", 
      type: "select",
      options: [
        "ศูนย์วิจัยและบริการเพื่อชุมชนและสังคม",
        "ศูนย์เทคโนโลยีชีวมวลบำบัดรักษา",
        "ศูนย์พัฒนาสินค้าอุตสาหกรรม",
        "ศูนย์ความเป็นเลิศด้านโลจิสติกส์",
        "ศูนย์วิจัยและบริการวิศวกรรมการเชื่อม",
        "ศูนย์บูรณาการเทคโนโลยีเพื่ออุตสาหกรรมไทย",
        "ศูนย์รับรองระบบมาตรฐานนานาชาติ",
        "ศูนย์การศึกษาต่อเนื่อง",
        "ศูนย์อิเล็กทรอนิกส์ยานยนต์",
        "ศูนย์วิจัยและพัฒนาการขนส่งทางถนน",
        "ศูนย์ความปลอดภัยอาหาร",
        "ศูนย์การศึกษาด้านการสื่อสารและการบริการครบวงจร",
        "ศูนย์กลยุทธ์และความสามารถทางการแข่งขันขององค์กร",
        "ศูนย์วิจัย Mobility & Vehicle Technology Research Center"
      ], 
      sm: 6 
    },
    
    { name: "tel", label: "หมายเลขโทรศัพท์ภายใน", sm: 6 },
    { name: "phone", label: "โทร", sm: 6 },

  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {customerData ? "Update Customer" : "Add New Customer"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please fill out the form below to {customerData ? "update" : "add"} a
          Customer.
        </DialogContentText>
        <Grid container spacing={2}>
          {formFields.map((field) => (
            <Grid item xs={12} sm={field.sm} key={field.name}>
              {field.type === "select" ? (
                <SelectField
                  name={field.name}
                  label={field.label}
                  value={formData[field.name]}
                  onChange={handleChange}
                  options={field.options}
                  fullWidth
                />
              ) : field.type === "date" ? (
                field.component
              ) : (
                <FormField
                  InputLabelProps={{ shrink: true }}
                  name={field.name}
                  label={field.label}
                  value={formData[field.name]}
                  onChange={handleChange}
                  type={field.type || "text"}
                  disabled={field.disabled}
                  fullWidth
                />
              )}
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          color="primary"
          disabled={isSubmitting}
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
