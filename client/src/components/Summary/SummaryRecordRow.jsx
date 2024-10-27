import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  IconButton,
  CircularProgress,
  Button,
} from "@mui/material";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import CustomerRecordPopup from "./CustomerRecordPopup";
import { useCustomerRecords } from "../../context/customerRecordContext";
import { useSelectedItem } from "../../context/mainContentContext";
import DeleteConfirmationDialog from "../Dialog/DeleteConfirmationDialog";
import { formatDateToThai } from "../../utils/helper";

const SummaryRecordRow = ({ customer }) => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [customerRecord, setCustomerRecord] = useState({
    start_date: "",
    end_date: "",
    item: "",
    count: "",
    item_number: "",
    status: "",
    detail: "",
  });
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState({
    customer_id: customer.customer_id,
    docId: null,
  });
  const { useFetchRecords, setCurrentEditRecord, deleteRecord } =
    useCustomerRecords();

  const { setSelectedSidebarItem } = useSelectedItem();

  const handleNewClick = (e, docId) => {
    e.stopPropagation();
    setCurrentEditRecord((prev) => ({
      customer_id: customer.customer_id,
      docId: { id: "create-new", label: "Create New Record" },
    }));
    setSelectedSidebarItem("Form");
  };

  const handleDeleteClick = (e, docId) => {
    e.stopPropagation();
    setRecordToDelete((prev) => ({
      customer_id: prev.customer_id,
      docId: docId,
    }));
    setDialogOpen(true);
  };

  const handleEditClick = (e, customer_id, docId) => {
    e.stopPropagation();
    setCurrentEditRecord({
      customer_id: customer_id,
      docId: { id: docId, label: docId },
    });
    setSelectedSidebarItem("Form");
  };

  const confirmDelete = () => {
    deleteRecord(recordToDelete);
    setDialogOpen(false);
  };

  const openPopup = () => setPopupOpen(true);
  const closePopup = () => setPopupOpen(false);

  // Fetch records for the given customer customer_id
  const CustomerRecordsDisplay = () => {
    const {
      data: records = [],
      isLoading,
      isError,
    } = useFetchRecords(customer.customer_id);

    if (isLoading) return <CircularProgress />;
    if (isError) return <div>Error loading records</div>;

    // Sort records by timestamp in descending order (latest first)
    const sortedRecords = records.slice().sort((a, b) => {
      return new Date(b.create_time) - new Date(a.create_time);
    });

    // Calculate the number of records
    const recordCount = sortedRecords.length;

    return (
      <>
        <TableRow>
          <TableCell
            colSpan={7}
            style={{ textAlign: "center", fontWeight: "bold" }}
          >
            จำนวนรายการทั้งหมด: {recordCount}
          </TableCell>
        </TableRow>
        {sortedRecords.map(
          (
            entry,
            index // Add index parameter here
          ) => (
            <TableRow
              key={entry.id}
              onClick={() => {
                setCustomerRecord(entry);
                openPopup();
              }}
            >
              <TableCell>{index + 1}</TableCell> {/* Order (Index) */}
              {/* <TableCell>{formatDateToThai(entry.create_time)}</TableCell>{" "} */}
              {/* Date */}
              <TableCell>{formatDateToThai(entry.start_date)}</TableCell>{" "}
              {/* Start Date */}
              <TableCell>{formatDateToThai(entry.end_date)}</TableCell>{" "}
              {/* End Date */}
              <TableCell>{entry.item}</TableCell> {/* Item */}
              <TableCell>{entry.count}</TableCell> {/* Count */}
              <TableCell>{entry.item_number}</TableCell> {/* Item Number */}
              <TableCell>{entry.detail}</TableCell> {/* Detail */}
              <TableCell>{entry.status}</TableCell> {/* Status */}
            </TableRow>
          )
        )}
      </>
    );
  };

  return (
    <>
      <TableRow sx={{ backgroundColor: "#F9DFB1" }}>
        <TableCell colSpan={8}>
          <div className="sub-row">
            <Table size="small">
              <TableHead sx={{ backgroundColor: "#d6521e" }}>
                <TableRow>
                  {" "}
                  {/* Set background color to orange */}
                  <TableCell sx={{ color: "white", fontSize: "1.25rem" }}>
                    ลำดับ
                  </TableCell>
                  <TableCell sx={{ color: "white", fontSize: "1.25rem" }}>
                    เริ่มต้น
                  </TableCell>
                  <TableCell sx={{ color: "white", fontSize: "1.25rem" }}>
                    สิ้นสุด
                  </TableCell>
                  <TableCell sx={{ color: "white", fontSize: "1.25rem" }}>
                    รายการ
                  </TableCell>
                  <TableCell sx={{ color: "white", fontSize: "1.25rem" }}>
                    จำนวน
                  </TableCell>
                  <TableCell sx={{ color: "white", fontSize: "1.25rem" }}>
                    หมายเลขครุภัณฑ์
                  </TableCell>
                  <TableCell sx={{ color: "white", fontSize: "1.25rem" }}>
                    หมายเหตุ
                  </TableCell>
                  <TableCell sx={{ color: "white", fontSize: "1.25rem" }}>
                    สถานะ
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <CustomerRecordsDisplay />
              </TableBody>
            </Table>
          </div>
        </TableCell>
      </TableRow>

      {/* <CustomerRecordPopup
        open={isPopupOpen}
        onClose={closePopup}
        customer={customer}
        record={customerRecord}
      /> */}
      <DeleteConfirmationDialog
        isOpen={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        contentText={`Are you sure you want to delete the record with id: ${recordToDelete.docId}?`}
      />
    </>
  );
};

export default SummaryRecordRow;
