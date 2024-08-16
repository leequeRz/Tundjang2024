import React from "react";
import TableComponent from "../Table/Table";
import "./MainDash.css";

const MainDash = ({ setSelectedSidebarItem }) => {
	return (
		<div className="MainDash">
			<TableComponent setSelectedSidebarItem={setSelectedSidebarItem} />
		</div>
	);
};

export default MainDash;
