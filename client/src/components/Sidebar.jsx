import React, { useState } from "react";
import "./Sidebar.css";
import kmutt from "../imgs/kmutt.png"; // Updated the image import
// import { UilSignOutAlt } from "@iconscout/react-unicons";
import { SidebarData } from "../Data/Data";
import { UilBars } from "@iconscout/react-unicons";
import { motion } from "framer-motion";
import { useSelectedItem } from "../context/mainContentContext";

const Sidebar = ({ onLogout }) => {
  const [expanded, setExpanded] = useState(true);

  const { selectedSidebarItem, setSelectedSidebarItem } = useSelectedItem();

  const sidebarVariants = {
    true: {
      left: "0",
    },
    false: {
      left: "-60%",
    },
  };

  return (
    <>
      <div
        className="bars"
        style={expanded ? { left: "60%" } : { left: "5%" }}
        onClick={() => setExpanded(!expanded)}
      >
        <UilBars />
      </div>
      <motion.div
        className="sidebar"
        variants={sidebarVariants}
        animate={window.innerWidth <= 768 ? `${expanded}` : ""}
      >
        {/* logo */}
        <div className="logo">
          <img src={kmutt} alt="kmutt logo" /> {/* Updated the image source */}
          <span>KMUTT</span>
        </div>

        <div className="menu">
          {SidebarData.map((item, index) => (
            <div
              className={
                selectedSidebarItem === item.heading
                  ? "menuItem active"
                  : "menuItem"
              }
              key={index}
              onClick={() => {
                if (item.heading === "Logout") {
                  onLogout();
                } else {
                  setSelectedSidebarItem(item.heading);
                }
              }}
            >
              <item.icon />
              <span>{item.heading}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
