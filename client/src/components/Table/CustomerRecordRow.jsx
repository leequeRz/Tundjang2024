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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomerRecordPopup from "./CustomerRecordPopup";
import { useCustomerRecords } from "../../context/customerRecordContext";
import { useSelectedItem } from "../../context/mainContentContext";
import DeleteConfirmationDialog from "../Dialog/DeleteConfirmationDialog";
import { formatDateToThai } from "../../utils/helper";

const CustomerRecordRow = ({ customer }) => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [customerRecord, setCustomerRecord] = useState({
    start_date: "",
    end_date: "",
    detail1: "",
    detail2: "",
    // excretion: "",
    // food_intake: [],
    // conscious: "",
    // timestamp: "",
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

    return sortedRecords.map((entry) => (
      <TableRow
        key={entry.id}
        onClick={() => {
          setCustomerRecord(entry);
          openPopup();
        }}
      >
        <TableCell>{formatDateToThai(entry.create_time)}</TableCell>
        <TableCell>{entry.notes}</TableCell>
        <TableCell>
          <Tooltip title="Edit Customer">
            <IconButton
              onClick={(e) => {
                handleEditClick(e, customer.customer_id, entry.id);
              }}
              color="primary"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete customer">
            <IconButton
              onClick={(e) => {
                handleDeleteClick(e, entry.id);
              }}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <>
      <TableRow>
        <TableCell colSpan={8}>
          <div className="sub-row">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Time</TableCell>
                  <TableCell>Detail</TableCell>
                  <TableCell>
                    <Button onClick={handleNewClick}>Add New Record</Button>
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

      <CustomerRecordPopup
        open={isPopupOpen}
        onClose={closePopup}
        customer={customer}
        record={customerRecord}
      />
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

export default CustomerRecordRow;
