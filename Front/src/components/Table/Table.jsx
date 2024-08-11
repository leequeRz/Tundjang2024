import React, { useState } from 'react';
import './Table.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

// Mock Data
const createData = (name, hospitalNumber, date, time) => {
  return { name, hospitalNumber, date, time };
};

const rows = [
  createData('Jane Cooper', 'HN001', '2024-08-09', '08:30 AM'),
  createData('Floyd Miles', 'HN002', '2024-08-09', '02:15 PM'),
  createData('Ronald Richards', 'HN003', '2024-08-09', '07:45 PM'),
  createData('Marvin McKinney', 'HN004', '2024-08-08', '10:00 AM'),
  createData('Jerome Bell', 'HN005', '2024-08-07', '01:30 PM'),
  createData('Kathryn Murphy', 'HN006', '2024-08-06', '05:00 PM'),
  createData('Jacob Jones', 'HN007', '2024-08-05', '09:15 AM'),
  createData('Kristin Watson', 'HN008', '2024-08-04', '03:00 PM'),
  createData('Alex Brown', 'HN009', '2024-08-03', '06:30 PM'),
  createData('Emily Davis', 'HN010', '2024-08-02', '11:00 AM'),
  createData('Oliver Wilson', 'HN011', '2024-08-01', '04:45 PM'),
  createData('Sophia Johnson', 'HN012', '2024-07-31', '08:00 AM'),
  createData('Liam Smith', 'HN013', '2024-07-30', '12:30 PM'),
  createData('Mia Martinez', 'HN014', '2024-07-29', '07:00 PM'),
  createData('Noah Lee', 'HN015', '2024-07-28', '09:45 AM'),
  createData('Isabella Clark', 'HN016', '2024-07-27', '03:30 PM'),
  createData('Ethan Lewis', 'HN017', '2024-07-26', '06:15 PM'),
  createData('Ava Walker', 'HN018', '2024-07-25', '10:30 AM'),
  createData('Lucas Hall', 'HN019', '2024-07-24', '02:00 PM'),
  createData('Charlotte Young', 'HN020', '2024-07-23', '07:30 PM'),
];

const TableComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 15;

  // Filter and paginate data
  const filteredRows = rows.filter(row =>
    row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.hospitalNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredRows.slice(indexOfFirstRow, indexOfLastRow);

  const handlePageChange = (direction) => {
    if (direction === 'next' && indexOfLastRow < filteredRows.length) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getColorByTime = (value) => {
    if (value.includes('AM')) return 'morning';
    if (value.includes('PM') && parseInt(value.split(':')[0], 10) < 6) return 'afternoon';
    return 'evening';
  };

  return (
    <div className="container-table">
      <div className="header-container">
        <div className="header-left">
          <div className="header-title">All Customers</div>
          <div className="header-link">Active Members</div>
        </div>
        <div className="header-right">
          <input
            type="text"
            className="search-input"
            placeholder="Search by Name or Hospital Number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="new-pt-button">New PT</button>
        </div>
      </div>

      <TableContainer component={Paper}>
        <Table className="Table">
          <TableHead>
            <TableRow>
              <TableCell>Customer Name</TableCell>
              <TableCell>Hospital Number</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.hospitalNumber}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell className={getColorByTime(row.time)}>{row.time}</TableCell>
                <TableCell>
                  <button onClick={() => alert(`Details for ${row.name}`)}>
                    Show Details
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredRows.length > rowsPerPage && (
        <div className="pagination">
          <span>Showing data {indexOfFirstRow + 1} to {Math.min(indexOfLastRow, filteredRows.length)} of {filteredRows.length} entries</span>
          <div className="pagination-controls">
            <button onClick={() => handlePageChange('prev')} disabled={currentPage === 1}>
              {'<'}
            </button>
            <button onClick={() => handlePageChange('next')} disabled={indexOfLastRow >= filteredRows.length}>
              {'>'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableComponent;
