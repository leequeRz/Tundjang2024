// Table.jsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableContainer,
  Paper,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useCustomers } from "../../context/customerContext";
import { usePagination } from "../../hooks/usePagination";
import { useSearch } from "../../hooks/useSearch";
import SearchBar from "../SearchBar";
import TableHeader from "./TableHeader";
import CustomerRow from "./CustomerRow";
import PaginationFooter from "./PaginationFooter";
import CustomerPopup from "./CustomerPopup";
import FilterListIcon from "@mui/icons-material/FilterList";
// import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FA4616", // Orange color
    },
  },
});

const TableComponent = () => {
  const { customers, isLoading, error, deleteCustomer } = useCustomers();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [expandedRows, setExpandedRows] = useState([]);

  const { searchTerm, setSearchTerm, filteredItems } = useSearch(customers, [
    "name",
    "surname",
    "customer_id",
  ]);
  const { currentItems, currentPage, handlePageChange } = usePagination(
    filteredItems,
    15
  );

  // Set the initial value to 2567
  const [selectedYear, setSelectedYear] = useState(2567); // Default as 2567

  // Automatically generate years starting from the current year
  const currentYear = new Date().getFullYear() + 543; // Convert to Buddhist year (พ.ศ.)
  const generateYears = (numYears) => {
    // Generate an array of years starting from the current year
    return Array.from({ length: numYears }, (_, i) => currentYear + i);
  };

  const years = generateYears(3); // Generate next 3 years

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setIsPopupOpen(true);
  };

  const handleDelete = (customer_id) => {
    deleteCustomer(customer_id);
  };

  const handleRowClick = (customer_ID) => {
    setExpandedRows((prev) =>
      prev.includes(customer_ID)
        ? prev.filter((rowCustomer_Id) => rowCustomer_Id !== customer_ID)
        : [...prev, customer_ID]
    );
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value); // Save selected year
    console.log("Selected Year:", event.target.value); // Log the selected year
  };

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error}</Typography>;

  return (
    <Box sx={{ p: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h5" sx={{ mr: 2 }}>
            รายชื่อคนยืมพัสดุ
          </Typography>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel id="year-select-label">ปี</InputLabel>
            <Select
              labelId="year-select-label"
              id="year-select"
              value={selectedYear} // Selected year
              label="ปี"
              onChange={handleYearChange} // Handle year selection
            >
              {years.map((year, index) => (
                <MenuItem key={index} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <ThemeProvider theme={theme}>
            <Button
              variant="contained"
              color="primary"
              sx={{
                // padding: "12px 24px",
                fontSize: "1rem",
                minWidth: "180px",
              }}
              onClick={() => {
                setEditingCustomer(null, setIsPopupOpen(true));
              }}
            >
              เพิ่มรายชื่อคนยืมพัสดุ
            </Button>
          </ThemeProvider>
          <ThemeProvider theme={theme}>
            {/* <Button
              variant="contained"
              color="primary"
              sx={{ ml: 2 }}
              onClick={() => {
                setEditingCustomer(null, setIsPopupOpen(true));
              }}
            >
              เพิ่มปี
            </Button> */}
          </ThemeProvider>
          <ThemeProvider theme={theme}>
            <Button
              variant="contained"
              color="primary"
              sx={{
                ml: 2,
                // padding: "12px 24px",
                fontSize: "1rem",
                minWidth: "150px",
              }}
              onClick={() => {
                setEditingCustomer(null, setIsPopupOpen(true));
              }}
            >
              เพิ่มพัสดุ
            </Button>
          </ThemeProvider>
          <ThemeProvider theme={theme}>
            <Button
              variant="outlined"
              color="primary"
              sx={{
                ml: 2,
                // padding: "12px 24px",
                fontSize: "1rem",
                minWidth: "150px",
                textTransform: "none",
              }}
            >
              <FilterListIcon sx={{ mr: 1 }} />
              Filters
            </Button>
          </ThemeProvider>
          {/* <ThemeProvider theme={theme}>
            <Button
              variant="outlined"
              color="primary"
              sx={{
                ml: 2,
                // padding: "12px 24px",
                fontSize: "1rem",
                minWidth: "150px",
                textTransform: "none",
              }}
            >
              <PictureAsPdfIcon sx={{ mr: 1 }} />
              Export PDF
            </Button>
          </ThemeProvider> */}
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHeader />
          <TableBody>
            {currentItems.map((row, index) => (
              <CustomerRow
                key={row.customer_id || index}
                row={row}
                isExpanded={expandedRows.includes(row.customer_id)}
                handleRowClick={handleRowClick}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <PaginationFooter
        total={filteredItems.length}
        currentPage={currentPage}
        rowsPerPage={15}
        onPageChange={handlePageChange}
      />

      <CustomerPopup
        open={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        customerData={editingCustomer}
      />
    </Box>
  );
};

export default TableComponent;
