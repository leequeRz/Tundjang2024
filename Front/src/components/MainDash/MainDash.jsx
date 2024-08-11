import React from "react";
<<<<<<< HEAD
import TableComponent from "../Table/Table";
import "./MainDash.css";

const MainDash = ({ setSelectedSidebarItem }) => {
  return (
    <div className="MainDash">
      <TableComponent setSelectedSidebarItem={setSelectedSidebarItem} />
=======
// import Cards from "../Cards/Cards";
import Table from "../Table/Table";
import "./MainDash.css";
const MainDash = () => {
  return (
    <div className="MainDash">
 
      {/* <Cards /> */}
      <Table />
>>>>>>> 9c1650dd2f1a38e9461a5508691b409fbccd8d73
    </div>
  );
};

export default MainDash;
