import React from 'react';
import './Table.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const createData = (name, BP, HR, RR, O2, BT) => {
  return { name, BP, HR, RR, O2, BT };
};

const rows = [
  createData('Jane Cooper', 'Normal', 'High Abnormal', 'High Abnormal', 'High Abnormal', 'High Abnormal'),
  createData('Floyd Miles', 'High Abnormal', 'Normal', 'High Abnormal', 'High Abnormal', 'High Abnormal'),
  createData('Ronald Richards', 'High Abnormal', 'Low Abnormal', 'Low Abnormal', 'High Abnormal', 'High Abnormal'),
  createData('Marvin McKinney', 'Low Abnormal', 'Low Abnormal', 'Low Abnormal', 'Normal', 'Normal'),
  createData('Jerome Bell', 'Low Abnormal', 'High Abnormal', 'High Abnormal', 'High Abnormal', 'High Abnormal'),
  createData('Kathryn Murphy', 'Low Abnormal', 'Low Abnormal', 'Normal', 'High Abnormal', 'High Abnormal'),
  createData('Jacob Jones', 'Normal', 'Normal', 'Low Abnormal', 'High Abnormal', 'Low Abnormal'),
  createData('Kristin Watson', 'Normal', 'Low Abnormal', 'Low Abnormal', 'Normal', 'Low Abnormal'),
];

const TableComponent = () => {
  return (
    <div className="container">
      <div className="header-container">
        <div className="header-left">
          <div className="header-title">All Customers</div>
          <div className="header-link">Active Members</div>
        </div>
        <div className="header-right">
          <input type="text" className="search-input" placeholder="Search" />
          <button className="new-pt-button">New PT</button>
        </div>
      </div>
      <TableContainer component={Paper}>
        <Table className="Table">
          <TableHead>
            <TableRow>
              <TableCell>Customer Name</TableCell>
              <TableCell>BP</TableCell>
              <TableCell>HR</TableCell>
              <TableCell>RR</TableCell>
              <TableCell>O2</TableCell>
              <TableCell>BT</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.BP}</TableCell>
                <TableCell>{row.HR}</TableCell>
                <TableCell>{row.RR}</TableCell>
                <TableCell>{row.O2}</TableCell>
                <TableCell>{row.BT}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="pagination">
        <span>Showing data 1 to 8 of 256K entries</span>
        <div className="pagination-controls">
          <button>{'<'}</button>
          <button className="active">1</button>
          <button>2</button>
          <button>3</button>
          <button>4</button>
          <button>...</button>
          <button>40</button>
          <button>{'>'}</button>
        </div>
      </div>
    </div>
  );
};

export default TableComponent;
