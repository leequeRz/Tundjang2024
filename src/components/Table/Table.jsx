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

// Mock Record Data (Replace with real API data)
const recordsData = {
  'HN001': [
    { timestamp: '2024-08-09 08:30 AM', detail: 'Record 1 for HN001' },
    { timestamp: '2024-08-10 09:00 AM', detail: 'Record 2 for HN001' },
  ],
  'HN002': [
    { timestamp: '2024-08-09 02:15 PM', detail: 'Record 1 for HN002' },
    { timestamp: '2024-08-10 03:30 PM', detail: 'Record 2 for HN002' },
  ],
  // Add more record data as needed
};

const TableComponent = ({ setSelectedSidebarItem }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState([]);
  const rowsPerPage = 15;

  const handleRowClick = (hospitalNumber) => {
    if (expandedRows.includes(hospitalNumber)) {
      setExpandedRows(expandedRows.filter((hn) => hn !== hospitalNumber));
    } else {
      setExpandedRows([...expandedRows, hospitalNumber]);
    }
  };

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
              <>
                <TableRow key={index} onClick={() => handleRowClick(row.hospitalNumber)}>
                  <TableCell>{row.hospitalNumber || 'No data'}</TableCell>
                  <TableCell>{row.name || 'No data'}</TableCell>
                  <TableCell>{row.date || 'No data'}</TableCell>
                  <TableCell className={getColorByTime(row.time)}>{row.time || 'No data'}</TableCell>
                  <TableCell>
                    {row.name ? (
                      <button onClick={() => handleRowClick(row.hospitalNumber)}>
                        Show Details
                      </button>
                    ) : (
                      <button disabled>No Details</button>
                    )}
                  </TableCell>
                </TableRow>
                {expandedRows.includes(row.hospitalNumber) && (
                  <TableRow key={`${index}-subrow`}>
                    <TableCell colSpan={5}>
                      <div className="sub-row">
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Timestamp</TableCell>
                              <TableCell>Detail</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {recordsData[row.hospitalNumber]?.map((record, subIndex) => (
                              <TableRow key={subIndex}>
                                <TableCell>{record.timestamp}</TableCell>
                                <TableCell>{record.detail}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
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
