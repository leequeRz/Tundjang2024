import React, { useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import SummaryRow from "./SummaryRow";
import SummaryTableHeader from "./SummaryTableHeader";
import { useCustomers } from "../../context/customerContext";
import { usePagination } from "../../hooks/usePagination";
import { useSearch } from "../../hooks/useSearch";
import PaginationFooter from "../Table/PaginationFooter";

// import { db } from "../../firebase";
// import { collection, getDocs } from "firebase/firestore";

const CustomTable = () => {
  const pdfRef = useRef();
  const [data, setData] = useState([]); // Start with an empty array

  const downloadPDF = () => {
    const input = pdfRef.current;

    html2canvas(input, {
      scale: 3,
      useCORS: true,
      logging: false, // Disable logging
      backgroundColor: "#ffffff", // Ensure white background
    }).then((canvas) => {
      // Set up PDF in landscape orientation
      const pdf = new jsPDF("l", "mm", "a4", true);

      // A4 dimensions in landscape (width: 297mm, height: 210mm)
      const pdfWidth = 297;
      const pdfHeight = 210;

      // Calculate dimensions of the HTML content
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      // Variables for tracking position and remaining content
      let heightLeft = imgHeight;
      let position = 0;
      const imgData = canvas.toDataURL("image/png", 1.0);

      // Add first page
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Add subsequent pages if content remains
      while (heightLeft > 0) {
        position -= pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      // Save the PDF with a timestamp
      const fileName = `document_${new Date().toISOString().slice(0, 10)}.pdf`;
      pdf.save(fileName);
    });
  };

  const addRow = () => {
    if (data.length < 20) {
      // Limit to 20 rows
      const newRow = { col1: "", col2: "", col3: "", col4: "", col5: "" };
      setData([...data, newRow]);
    } else {
      alert("Maximum of 20 rows reached.");
    }
  };

  const removeRow = (index) => {
    const newData = data.filter((_, rowIndex) => rowIndex !== index);
    setData(newData);
  };

  const handleChange = (index, col, value) => {
    const updatedData = data.map((row, rowIndex) => {
      if (rowIndex === index) {
        return { ...row, [col]: value };
      }
      return row;
    });
    setData(updatedData);
  };

  const columns = [
    "ครุภัณฑ์",
    "หมายเลขครุภัณฑ์",
    "เริ่มต้น",
    "สิ้นสุด",
    "สถานะ",
  ]; // Define your columns

  const { customers, isLoading, error, deleteCustomer } = useCustomers();

  const { searchTerm, setSearchTerm, filteredItems } = useSearch(customers, [
    "name",
    "surname",
    "customer_id",
  ]);

  const { currentItems, currentPage, handlePageChange } = usePagination(
    filteredItems,
    15
  );

  const [expandedRows, setExpandedRows] = useState([]);

  const handleRowClick = (customer_ID) => {
    setExpandedRows((prev) =>
      prev.includes(customer_ID)
        ? prev.filter((rowCustomer_Id) => rowCustomer_Id !== customer_ID)
        : [...prev, customer_ID]
    );
  };
  // useEffect(() => {
  //   loadData();
  // }, []);

  // const loadData = async () => {
  //   await getDocs(collection(db, "customers"))
  //     .then((query) => {
  //       console.log(query);
  //       const newData = query.docs.map((doc) => {console.log(doc)});

  //     })
  //     .catch((error) => {
  //       console.error("Error getting documents: ", error);
  //     });
  // };

  return (
    <div style={{ width: "297mm", margin: "0 auto" }}>
      <Button onClick={downloadPDF}>Download PDF</Button>
      {/* <Button onClick={addRow} style={{ marginLeft: "10px" }}>
        Add Row
      </Button> */}

      <div ref={pdfRef}>
        <TableContainer component={Paper}>
          <Table>
            <SummaryTableHeader />
            <TableBody>
              {currentItems.map((row, index) => (
                <SummaryRow
                  key={row.customer_id || index}
                  row={row}
                  isExpanded={expandedRows.includes(row.customer_id)}
                  handleRowClick={handleRowClick}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <PaginationFooter
        total={filteredItems.length}
        currentPage={currentPage}
        rowsPerPage={15}
        onPageChange={handlePageChange}
      />
      {/* <TableContainer component={Paper} ref={pdfRef}>
        <Table style={{ width: "100%" }}>
          <TableHead>
            <TableRow>
              {columns.map((col, index) => (
                <TableCell
                  key={index}
                  style={{
                    width: `${100 / columns.length}%`,
                    wordBreak: "break-word",
                    whiteSpace: "normal",
                  }}
                >
                  {col}
                </TableCell>
              ))}
              <TableCell style={{ width: "10%" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((col, colIndex) => (
                  <TableCell
                    key={colIndex}
                    style={{ wordBreak: "break-word", whiteSpace: "normal" }}
                  >
                    <input
                      type="text"
                      value={row[col] || ""}
                      onChange={(e) =>
                        handleChange(rowIndex, col, e.target.value)
                      }
                      style={{ width: "100%", border: "none", outline: "none" }}
                    />
                  </TableCell>
                ))}
                <TableCell>
                  <Button onClick={() => removeRow(rowIndex)} color="error">
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer> */}
    </div>
  );
};

export default CustomTable;
