// import React, { useState } from "react";
// import {
//   TableRow,
//   TableCell,
//   Tooltip,
//   IconButton,
//   Button,
// } from "@mui/material";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// // import { calculateAge } from "../../utils/helper";

// import CustomerRecordRow from "./CustomerRecordRow";
// import DeleteConfirmationDialog from "../Dialog/DeleteConfirmationDialog";
// import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
// import { createTheme, ThemeProvider } from "@mui/material/styles";

// const CustomerRow = ({ row, isExpanded, handleRowClick, onEdit, onDelete }) => {
//   const { customer_id, name, surname, phone, tel, role, group } = row;
//   const [isDialogOpen, setDialogOpen] = useState(false);
//   const [customerToDelete, setCustomerToDelete] = useState(null);

//   const isCustomer_idPresent = !!customer_id;

//   // Define a media query to check if the screen is mobile-sized
//   // const isMobile = useMediaQuery('(max-width:600px)');

//   const handleDeleteClick = (e) => {
//     e.stopPropagation();
//     setCustomerToDelete(customer_id);
//     setDialogOpen(true);
//   };

//   const confirmDelete = () => {
//     onDelete(customerToDelete);
//     setDialogOpen(false);
//   };

//   const theme = createTheme({
//     palette: {
//       primary: {
//         main: "#FA4616", // Orange color
//       },
//     },
//   });

//   return (
//     <>
//       <TableRow onClick={() => handleRowClick(customer_id)}>
//         <TableCell>{customer_id || ""}</TableCell>
//         {/* {!isMobile && <TableCell>{prefix || ""}</TableCell>} */}
//         <TableCell>{name || ""}</TableCell>
//         <TableCell>{surname || ""}</TableCell>
//         <TableCell>{phone || ""}</TableCell>
//         <TableCell>{tel || ""}</TableCell>
//         <TableCell>{role || ""}</TableCell>
//         <TableCell>{group || ""}</TableCell>

//         <TableCell>
//           <Tooltip title="Edit Customer">
//             <IconButton
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onEdit(row);
//               }}
//               color="primary"
//               disabled={!isCustomer_idPresent}
//             >
//               <EditIcon />
//             </IconButton>
//           </Tooltip>
//           <Tooltip title="Delete Customer">
//             <IconButton
//               onClick={handleDeleteClick}
//               color="error"
//               disabled={!isCustomer_idPresent}
//             >
//               <DeleteIcon />
//             </IconButton>
//           </Tooltip>
//         </TableCell>
//         <TableCell>
//           <ThemeProvider theme={theme}>
//             <Button
//               variant="outlined"
//               color="primary"
//               sx={{
//                 ml: 2,
//                 // padding: "12px 24px",
//                 fontSize: "1rem",
//                 minWidth: "150px",
//                 textTransform: "none",
//               }}
//             >
//               <PictureAsPdfIcon sx={{ mr: 1 }} />
//               Export PDF
//             </Button>
//           </ThemeProvider>
//         </TableCell>
//       </TableRow>
//       {isExpanded && <CustomerRecordRow customer={row} />}

//       <DeleteConfirmationDialog
//         isOpen={isDialogOpen}
//         onClose={() => setDialogOpen(false)}
//         onConfirm={confirmDelete}
//         title="Confirm Deletion"
//         contentText={`Are you sure you want to delete the Customer with customer_id: ${customer_id}?`}
//       />
//     </>
//   );
// };

// export default CustomerRow;

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
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios"; // Import axios

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

  // Function to request PDF generation
  const pdfGenerate = async () => {
    try {
      const response = await axios.get("/pdf", {
        responseType: "blob", // Important for handling binary data
      });

      // Create a download link for the PDF
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "output.pdf"); // Set the file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // Clean up
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    }
  };

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
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Customer">
            <IconButton
              onClick={handleDeleteClick}
              color="error"
              disabled={!isCustomer_idPresent}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
        <TableCell>
          <ThemeProvider theme={theme}>
            <Button
              variant="outlined"
              color="primary"
              onClick={(e) => {
                e.stopPropagation(); // Prevents triggering row click
                pdfGenerate(); // Call the function
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
          </ThemeProvider>
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
