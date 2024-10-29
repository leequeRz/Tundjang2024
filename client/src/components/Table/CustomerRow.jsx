import React, { useState } from "react";
import {
  TableRow,
  TableCell,
  Tooltip,
  IconButton,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
// import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import CustomerRecordRow from "./CustomerRecordRow";
import DeleteConfirmationDialog from "../Dialog/DeleteConfirmationDialog";

const CustomerRow = ({ row, isExpanded, handleRowClick, onEdit, onDelete }) => {
  const { customer_id, name, surname, phone, tel, role, group } = row;
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  const isCustomer_idPresent = !!customer_id;

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setCustomerToDelete(customer_id);
    setDialogOpen(true);
  };

  const confirmDelete = () => {
    onDelete(customerToDelete);
    setDialogOpen(false);
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: "#FA4616", // Orange color
      },
    },
  });

  return (
    <>
      <TableRow onClick={() => handleRowClick(customer_id)}>
        <TableCell>{customer_id || ""}</TableCell>
        <TableCell>{name || ""}</TableCell>
        <TableCell>{surname || ""}</TableCell>
        <TableCell>{phone || ""}</TableCell>
        <TableCell>{tel || ""}</TableCell>
        <TableCell>{role || ""}</TableCell>
        <TableCell>{group || ""}</TableCell>

        <TableCell>
          <Tooltip title="Edit Customer">
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onEdit(row);
              }}
              color="primary"
              disabled={!isCustomer_idPresent}
              sx={{
                backgroundColor: "orange", // Set background color to orange
                color: "white", // Set icon color to white
                borderRadius: "8px", // Make the button appear as a rectangle with rounded corners
                "&:hover": {
                  // Optional: Change background color on hover
                  backgroundColor: "#cc5200", // Darker orange on hover
                },
                padding: "6px",
                marginRight: "8px",
              }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Customer">
            <IconButton
              onClick={handleDeleteClick}
              color="error"
              disabled={!isCustomer_idPresent}
              sx={{
                backgroundColor: "red", // Set background color to red
                color: "white", // Set icon color to white
                borderRadius: "8px", // Make the button appear as a rectangle with rounded corners
                "&:hover": {
                  // Optional: Change background color on hover
                  backgroundColor: "#b30000", // Darker red on hover
                },
                padding: "6px", // Increase padding for better spacing
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
        <TableCell>
          {/* <ThemeProvider theme={theme}>
            <Button
              variant="outlined"
              color="primary"
              onClick={(e) => {
                e.stopPropagation(); // Prevents triggering row click // Call the function
              }}
              sx={{
                ml: 2,
                fontSize: "1rem",
                minWidth: "150px",
                textTransform: "none",
              }}
            >
              <PictureAsPdfIcon sx={{ mr: 1 }} />
              Export PDF
            </Button>
          </ThemeProvider> */}
        </TableCell>
      </TableRow>
      {isExpanded && <CustomerRecordRow customer={row} />}

      <DeleteConfirmationDialog
        isOpen={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        contentText={`Are you sure you want to delete the Customer with customer_id: ${customer_id}?`}
      />
    </>
  );
};

export default CustomerRow;
