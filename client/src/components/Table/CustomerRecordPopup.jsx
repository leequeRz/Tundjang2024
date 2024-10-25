import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Container,
  Divider,
  Typography,
  Grid,
  Button,
} from "@mui/material";
import { formatDateToThai } from "../../utils/helper";
const CustomerRecordPopup = ({ open, onClose, customer, record }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md" // Ensure the size is "md" for better readability
      fullWidth
      sx={{ padding: "1rem" }}
    >
      <DialogTitle>
        <Typography variant="h5" component="div">
          รายละเอียดการยืม
        </Typography>
      </DialogTitle>

      <Divider sx={{ marginY: "1rem" }} />
      <DialogContent>
        <Container>
          <Typography variant="h6" gutterBottom>
            ส่วนที่ 1 ข้อมูลผู้ยืมอุปกรณ์
          </Typography>
          <Grid container spacing={1}>
            {/* Static Inputs */}
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" gutterBottom>
                <strong>รหัสประจำตัว:</strong> {customer.customer_id}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" gutterBottom>
                <strong>ชื่อ-สกุล:</strong> {customer.name} {customer.surname}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" gutterBottom>
                <strong>ตำแหน่ง:</strong> {customer.role}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" gutterBottom>
                <strong>สังกัด:</strong> {customer.group}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" gutterBottom>
                <strong>โทรศัพย์:</strong> {customer.phone}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1" gutterBottom>
                <strong>โทรศัพย์ภายใน:</strong> {customer.tel}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ marginY: "2rem" }} />

          {/* Vital Signs Section */}
          <Typography variant="h6" gutterBottom>
            ส่วนที่ 2 ข้อมูลครุภัณฑ์
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="body1" gutterBottom>
                <strong>ยืมตั้งแต่วันที่ :</strong> {formatDateToThai(record.start_date)}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" gutterBottom>
                <strong>ถึงวันที่ :</strong> {formatDateToThai(record.end_date)}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" gutterBottom>
                <strong>รายการยืม :</strong> {record.item}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" gutterBottom>
                <strong>จำนวน :</strong> {record.count}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" gutterBottom>
                <strong>วัตถุประสงค์เพื่อ :</strong> {record.detail}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ marginY: "2rem" }} />
          <Grid container spacing={1}>
            <Typography variant="h6" gutterBottom>
              <strong>สถานะปัจจุบัน :</strong> {record.status}
            </Typography>
          </Grid>
        </Container>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          <Typography variant="button" display="block" gutterBottom>
            ปิด
          </Typography>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomerRecordPopup;
