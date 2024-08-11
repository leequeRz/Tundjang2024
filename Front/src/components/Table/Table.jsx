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
  // Add more rows as needed
];

const TableComponent = ({ setSelectedSidebarItem }) => {
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

  // Add empty rows if there are less than rowsPerPage rows
  const paddedRows = [
    ...currentRows,
    ...Array(Math.max(rowsPerPage - currentRows.length, 0)).fill({
      name: '',
      hospitalNumber: '',
      date: '',
      time: ''
    })
  ];

  const handlePageChange = (direction) => {
    if (direction === 'next' && indexOfLastRow < filteredRows.length) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getColorByTime = (value) => {
    if (value.includes('AM')) return 'morning';
    if (value.includes('PM') && parseInt(value.split(':')[0], 10) < 6)
      return 'afternoon';
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
          <button 
            className="new-pt-button" 
            onClick={() => setSelectedSidebarItem('Form')}
          >
            New PT
          </button>
        </div>
      </div>

      <TableContainer component={Paper}>
        <Table className="Table">
          <TableHead>
            <TableRow>
              <TableCell>Hospital Number</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paddedRows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.hospitalNumber || 'No data'}</TableCell>
                <TableCell>{row.name || 'No data'}</TableCell>
                <TableCell>{row.date || 'No data'}</TableCell>
                <TableCell className={getColorByTime(row.time)}>{row.time || 'No data'}</TableCell>
                <TableCell>
                  {row.name ? (
                    <button onClick={() => alert(`Details for ${row.name}`)}>
                      Show Details
                    </button>
                  ) : (
                    <button disabled>No Details</button>
                  )}
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
            <button
              onClick={() => handlePageChange('prev')}
              disabled={currentPage === 1}
            >
              {'<'}
            </button>
            <button
              onClick={() => handlePageChange('next')}
              disabled={indexOfLastRow >= filteredRows.length}
            >
              {'>'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableComponent;
