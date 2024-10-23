// import React, { useState } from "react";
// import {
//   Box,
//   Typography,
//   Button,
//   Table,
//   TableBody,
//   TableContainer,
//   Paper,
//   InputLabel,
//   MenuItem,
//   FormControl,
//   Select,
// } from "@mui/material";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import { usePatients } from "../../context/patientContext";
// import { usePagination } from "../../hooks/usePagination";
// import { useSearch } from "../../hooks/useSearch";
// import SearchBar from "../SearchBar";
// import TableHeader from "./TableHeader";
// import PatientRow from "./CustomerRow";
// import PaginationFooter from "./PaginationFooter";
// import PatientPopup from "./CustomerPopup";
// import FilterListIcon from "@mui/icons-material/FilterList";
// import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: "#FA4616", // Orange color
//     },
//   },
// });

// const TableComponent = () => {
//   const { patients, isLoading, error, deletePatient } = usePatients();
//   const [isPopupOpen, setIsPopupOpen] = useState(false);
//   const [editingPatient, setEditingPatient] = useState(null);
//   const [expandedRows, setExpandedRows] = useState([]);

//   // Set the initial value to 2567
//   const [selectedYear, setSelectedYear] = useState(2567); // Default as 2567

//   // Automatically generate years starting from the current year
//   const currentYear = new Date().getFullYear() + 543; // Convert to Buddhist year (พ.ศ.)
//   const generateYears = (numYears) => {
//     // Generate an array of years starting from the current year
//     return Array.from({ length: numYears }, (_, i) => currentYear + i);
//   };

//   const years = generateYears(3); // Generate next 3 years

//   const { searchTerm, setSearchTerm, filteredItems } = useSearch(patients, [
//     "name",
//     "surname",
//     "HN",
//   ]);
//   const { currentItems, currentPage, handlePageChange } = usePagination(
//     filteredItems,
//     15
//   );

//   const handleEdit = (patient) => {
//     setEditingPatient(patient);
//     setIsPopupOpen(true);
//   };

//   const handleDelete = (HN) => {
//     deletePatient(HN);
//   };

//   const handleRowClick = (hn) => {
//     setExpandedRows((prev) =>
//       prev.includes(hn) ? prev.filter((rowHn) => rowHn !== hn) : [...prev, hn]
//     );
//   };

//   const handleYearChange = (event) => {
//     setSelectedYear(event.target.value); // Save selected year
//     console.log("Selected Year:", event.target.value); // Log the selected year
//   };

//   if (isLoading) return <Typography>Loading...</Typography>;
//   if (error) return <Typography>Error: {error}</Typography>;

//   return (
//     <Box sx={{ p: 2 }}>
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           mb: 2,
//         }}
//       >
//         <Box sx={{ display: "flex", alignItems: "center" }}>
//           <Typography variant="h6" sx={{ mr: 2 }}>
//             รายชื่อคนยืมพัสดุ
//           </Typography>
//           <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
//             <InputLabel id="year-select-label">ปี</InputLabel>
//             <Select
//               labelId="year-select-label"
//               id="year-select"
//               value={selectedYear} // Selected year
//               label="ปี"
//               onChange={handleYearChange} // Handle year selection
//             >
//               {years.map((year, index) => (
//                 <MenuItem key={index} value={year}>
//                   {year}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Box>
//         <Box sx={{ display: "flex", alignItems: "center" }}>
//           <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
//           <ThemeProvider theme={theme}>
//             <Button
//               variant="contained"
//               color="primary"
//               sx={{ ml: 2 }}
//               onClick={() => {
//                 setEditingPatient(null, setIsPopupOpen(true));
//               }}
//             >
//               เพิ่มรายชื่อคนยืมพัสดุ
//             </Button>
//           </ThemeProvider>
//           <ThemeProvider theme={theme}>
//             <Button
//               variant="contained"
//               color="primary"
//               sx={{ ml: 2 }}
//               onClick={() => {
//                 setEditingPatient(null, setIsPopupOpen(true));
//               }}
//             >
//               เพิ่มปี
//             </Button>
//           </ThemeProvider>
//           <ThemeProvider theme={theme}>
//             <Button
//               variant="contained"
//               color="primary"
//               sx={{ ml: 2 }}
//               onClick={() => {
//                 setEditingPatient(null, setIsPopupOpen(true));
//               }}
//             >
//               เพิ่มพัสดุ
//             </Button>
//           </ThemeProvider>
//           <ThemeProvider theme={theme}>
//             <Button
//               variant="outlined"
//               color="primary"
//               sx={{ ml: 2, textTransform: "none" }}
//             >
//               <FilterListIcon sx={{ mr: 1 }} />
//               Filters
//             </Button>
//           </ThemeProvider>
//           <ThemeProvider theme={theme}>
//             <Button
//               variant="outlined"
//               color="primary"
//               sx={{ ml: 2, textTransform: "none" }}
//             >
//               <PictureAsPdfIcon sx={{ mr: 1 }} />
//               Export PDF
//             </Button>
//           </ThemeProvider>
//         </Box>
//       </Box>

//       <TableContainer component={Paper}>
//         <Table>
//           <TableHeader />
//           <TableBody>
//             {currentItems.map((row, index) => (
//               <PatientRow
//                 key={row.HN || index}
//                 row={row}
//                 isExpanded={expandedRows.includes(row.HN)}
//                 handleRowClick={handleRowClick}
//                 onEdit={handleEdit}
//                 onDelete={handleDelete}
//               />
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <PaginationFooter
//         total={filteredItems.length}
//         currentPage={currentPage}
//         rowsPerPage={15}
//         onPageChange={handlePageChange}
//       />

//       <PatientPopup
//         open={isPopupOpen}
//         onClose={() => setIsPopupOpen(false)}
//         patientData={editingPatient}
//       />
//     </Box>
//   );
// };

// export default TableComponent;
